import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';

// Import Entities
import { User } from '../user/entities/user.entity';
import { Post } from '../post/entities/post.entity';
import { Traffic } from './entities/traffic.entity';


@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(Traffic)
    private trafficRepository: Repository<Traffic>,
  ) { }

  async logTraffic() {
    const todayStr = new Date().toISOString().split('T')[0]; // Lấy ngày YYYY-MM-DD

    // Tìm record của ngày hôm nay
    let traffic = await this.trafficRepository.findOneBy({ date: todayStr });

    if (traffic) {
      // Nếu đã có record hôm nay -> Tăng view
      traffic.pageViews += 1;
      traffic.visitors += 1; // (Tạm thời tăng visitor đơn giản, thực tế cần check IP)
    } else {
      // Nếu chưa có (ngày mới) -> Tạo record mới
      traffic = this.trafficRepository.create({
        date: todayStr,
        visitors: 1,
        pageViews: 1
      });
    }

    return this.trafficRepository.save(traffic);
  }

  /**
   * Lấy dữ liệu tổng quan cho Dashboard
   * @param period 'week' | 'month'
   */
  async getStats(period: string) {
    // Đếm tổng số lượng (Realtime)
    const totalUsers = await this.userRepository.count();
    const totalPosts = await this.postRepository.count();

    // Lấy 5 bài viết mới nhất
    // Lưu ý: Đảm bảo Post entity có quan hệ với User (property 'user') để lấy tên tác giả
    const recentPosts = await this.postRepository.find({
      take: 5,
      order: { createdAt: 'DESC' } as any,
      relations: ['user'],
    });

    //  Xử lý dữ liệu biểu đồ Traffic
    const chartData = await this.getTrafficChartData(period);

    return {
      traffic: chartData,
      totalUsers,
      totalPosts,
      recentPosts
    };
  }

  // Helper: Query và format dữ liệu traffic cho biểu đồ
  private async getTrafficChartData(period: string) {
    const endDate = new Date();
    const startDate = new Date();

    if (period === 'month') {
      startDate.setDate(endDate.getDate() - 30);
    } else {
      startDate.setDate(endDate.getDate() - 6); // Lấy 7 ngày gần nhất (tính cả hôm nay)
    }

    // Query Database lấy các record trong khoảng thời gian
    const rawTraffic = await this.trafficRepository.find({
      where: {
        date: Between(startDate.toISOString().split('T')[0], endDate.toISOString().split('T')[0]),
      },
      order: { date: 'ASC' },
    });

    // Khai báo kiểu dữ liệu rõ ràng cho mảng data để tránh lỗi 'never[]'
    const data: { name: string; fullDate: string; visitors: number; pageViews: number }[] = [];

    const loopDate = new Date(startDate);

    while (loopDate <= endDate) {
      const dateStr = loopDate.toISOString().split('T')[0];

      // Tìm xem ngày này có trong DB không
      const record = rawTraffic.find(t => t.date === dateStr);

      data.push({
        name: this.getDayName(loopDate),
        fullDate: dateStr,
        visitors: record ? record.visitors : 0,
        pageViews: record ? record.pageViews : 0,
      });

      // Tăng loopDate lên 1 ngày
      loopDate.setDate(loopDate.getDate() + 1);
    }

    return data;
  }

  // Helper: Lấy tên thứ tiếng Việt
  private getDayName(date: Date): string {
    const days = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
    return days[date.getDay()];
  }

// Quản lý người dùng
  async getAllUsers() {
    return this.userRepository.find({
      order: { id: 'DESC' } as any,
    });
  }

  async deleteUser(id: number) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`User với ID ${id} không tồn tại`);
    }
    return { message: 'Đã xóa người dùng thành công' };
  }

  async updateUserRole(id: number, newRole: string) {
    const user = await this.userRepository.findOneBy({ id } as any);
    if (!user) throw new NotFoundException('User không tồn tại');

    // Ép kiểu as any để tránh lỗi TypeScript nếu entity User chưa khai báo role
    (user as any).role = newRole;

    return this.userRepository.save(user);
  }

// Quản lý bài viết
  async getAllPosts() {
    return this.postRepository.find({
      order: { createdAt: 'DESC' } as any,
      relations: ['user'], // Lấy thông tin người đăng bài
    });
  }

  async deletePost(id: number) {
    const result = await this.postRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Bài viết với ID ${id} không tồn tại`);
    }
    return { message: 'Đã xóa bài viết thành công' };
  }
}