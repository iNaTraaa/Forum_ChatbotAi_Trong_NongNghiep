import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../user/entities/user.entity';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import type { File as MulterFile } from 'multer';
import { Vote } from './entities/vote.entity';
import { VoteDto } from './dto/vote-post.dto'; 

@Injectable()
export class PostService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        @InjectRepository(Post) private postRepository: Repository<Post>,
        @InjectRepository(Vote) private voteRepository: Repository<Vote>,
    ) { }

    // Tạo bài viết
    async create(userId: number, createPostDto: CreatePostDto, file?: MulterFile): Promise<Post> {
        const user = await this.userRepository.findOne({ where: { id: userId } });
        if (!user) {
            throw new HttpException('User not found', HttpStatus.NOT_FOUND);
        }

        try {
            const newPostData = {
                ...createPostDto,
                user: user,
                thumbnail: file ? file.filename : null,
                score: 0, // Khởi tạo điểm là 0
            };

            const post = this.postRepository.create(newPostData);
            await this.postRepository.save(post);

            return post;
        } catch (error) {
            console.error('LỖI TẠO BÀI VIẾT:', error);
            throw new HttpException('Không thể tạo bài viết do lỗi server', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy danh sách bài viết
    // Thêm tham số userId (optional) để check trạng thái like/dislike của người xem
    async findAll(currentUserId?: number): Promise<any[]> {
        try {
            // Lấy danh sách bài viết và thông tin người đăng
            const posts = await this.postRepository.createQueryBuilder('post')
                .leftJoin('post.user', 'user')
                .addSelect(['user.id', 'user.first_Name', 'user.last_Name', 'user.avatar'])
                .loadRelationCountAndMap('post.commentCount', 'post.comments')
                .orderBy('post.createdAt', 'DESC')
                .getMany();

            // Nếu người dùng chưa đăng nhập (khách), trả về danh sách thô (userVoteStatus = 0)
            if (!currentUserId) {
                return posts.map(post => ({
                    ...post,
                    userVoteStatus: 0
                }));
            }

            // Nếu đã đăng nhập, kiểm tra từng bài xem user này đã vote chưa
            // Sử dụng Promise.all để map dữ liệu bất đồng bộ
            const postsWithStatus = await Promise.all(posts.map(async (post) => {
                const vote = await this.voteRepository.findOne({
                    where: { postId: post.id, userId: currentUserId }
                });

                return {
                    ...post,
                    // Nếu tìm thấy vote thì trả về value (1 hoặc -1), không thì 0
                    userVoteStatus: vote ? vote.value : 0
                };
            }));

            return postsWithStatus;

        } catch (error) {
            console.error('LỖI LẤY DANH SÁCH BÀI VIẾT:', error);
            throw new HttpException('Không thể lấy danh sách bài viết', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Lấy chi tiết một bài viết
    async findOne(id: number, userId?: number): Promise<any> {
        // Tìm bài viết theo ID
        const post = await this.postRepository.findOne({
            where: { id },
            relations: ['user'], // Lấy luôn thông tin người đăng
        });

        if (!post) {
            throw new NotFoundException(`Bài viết với ID ${id} không tồn tại`);
        }

        // Ẩn mật khẩu user nếu lỡ lấy thừa (TypeORM relations thường lấy hết)
        // if (post.user) {
        //     delete post.user.password;
        //     delete post.user.refresh_token;
        // }

        // Nếu là khách -> trả về luôn
        if (!userId) {
            return { ...post, userVoteStatus: 0 };
        }

        // Nếu đã đăng nhập -> Check xem đã like chưa
        const vote = await this.voteRepository.findOne({
            where: { postId: id, userId: userId }
        });

        return {
            ...post,
            userVoteStatus: vote ? vote.value : 0
        };
    }

    // Xử lý vote (like/dislike) trên bài viết
    async voteOnPost(userId: number, postId: number, voteDto: VoteDto) {
        const { direction } = voteDto; // 1 (Like), -1 (Dislike)
        const post = await this.postRepository.findOne({ where: { id: postId } });
        if (!post) throw new NotFoundException('Bài viết không tồn tại');

        const existingVote = await this.voteRepository.findOne({ where: { userId, postId } });
        let finalVoteStatus = direction;

        if (existingVote) {
            // Trường hợp A: Đã vote rồi
            if (existingVote.value === direction) {
                // A1. Bấm lại nút cũ -> Hủy vote (Toggle Off)
                await this.voteRepository.remove(existingVote);

                if (direction === 1) {
                    post.likeCount--; // Giảm like
                    post.score--;
                } else {
                    post.dislikeCount--; // Giảm dislike
                    post.score++;
                }
                finalVoteStatus = 0;
            } else {
                // A2. Bấm nút ngược lại -> Chuyển vote
                if (direction === 1) {
                    // Chuyển từ Dislike sang Like
                    post.dislikeCount--;
                    post.likeCount++;
                    post.score += 2;
                } else {
                    // Chuyển từ Like sang Dislike
                    post.likeCount--;
                    post.dislikeCount++;
                    post.score -= 2;
                }

                existingVote.value = direction;
                await this.voteRepository.save(existingVote);
            }
        } else {
            // Trường hợp B: Chưa vote -> Tạo mới
            const newVote = this.voteRepository.create({ userId, postId, value: direction });
            await this.voteRepository.save(newVote);

            if (direction === 1) {
                post.likeCount++;
                post.score++;
            } else {
                post.dislikeCount++;
                post.score--;
            }
        }

        // Đảm bảo không có số âm (Safety check)
        if (post.likeCount < 0) post.likeCount = 0;
        if (post.dislikeCount < 0) post.dislikeCount = 0;

        const savedPost = await this.postRepository.save(post);

        return {
            ...savedPost,
            userVoteStatus: finalVoteStatus
        };
    }

    // Xóa tất cả bài viết (DÙNG CHO MỤC ĐÍCH TEST)
    async deleteAll(): Promise<{ message: string }> {
        try {
            // Cần xóa Vote trước vì Vote có khóa ngoại tham chiếu đến Post
            await this.voteRepository.clear();
            await this.postRepository.clear();

            return { message: 'Đã xóa sạch dữ liệu bài viết và vote.' };
        } catch (error) {
            console.error('LỖI XÓA DỮ LIỆU:', error);
            throw new HttpException('Lỗi khi xóa dữ liệu', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}