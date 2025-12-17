import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Post } from 'src/post/entities/post.entity';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private commentRepository: Repository<Comment>,
    @InjectRepository(Post) private postRepository: Repository<Post>,
  ) { }

  // Tạo bình luận mới
  async create(userId: number, createCommentDto: CreateCommentDto): Promise<Comment> {
    const post = await this.postRepository.findOne({ where: { id: createCommentDto.postId } });
    if (!post) throw new NotFoundException('Bài viết không tồn tại');

    const newComment = this.commentRepository.create({
      content: createCommentDto.content,
      postId: createCommentDto.postId,
      userId: userId
    });

    // Lưu và trả về kèm thông tin user để Frontend hiển thị ngay (avatar, tên...)
    const savedComment = await this.commentRepository.save(newComment);
    // Dùng findOneOrFail để đảm bảo kiểu trả về không bao giờ là null
    return this.commentRepository.findOneOrFail({
      where: { id: savedComment.id },
      relations: ['user']
    });
  }

  // Lấy danh sách bình luận theo Post ID
  async findByPostId(postId: number): Promise<Comment[]> {
    return this.commentRepository.find({
      where: { postId },
      order: { createdAt: 'DESC' }, // Mới nhất lên đầu
      relations: ['user'] // Lấy kèm thông tin người comment
    });
  }

  // Xóa bình luận (Chỉ cho phép chủ comment xóa)
  async remove(id: number, userId: number) {
    const comment = await this.commentRepository.findOne({ where: { id } });
    if (!comment) throw new NotFoundException('Bình luận không tồn tại');

    if (comment.userId !== userId) {
      throw new ForbiddenException('Bạn không có quyền xóa bình luận này');
    }

    return this.commentRepository.remove(comment);
  }
}