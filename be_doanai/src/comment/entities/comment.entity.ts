import {
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';

@Entity('comments') 
export class Comment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @CreateDateColumn()
    createdAt: Date;

    // Liên kết với User (Người bình luận)
    @ManyToOne(() => User, { eager: true }) // eager: true để luôn lấy thông tin user khi query comment
    @JoinColumn({ name: 'userId' })
    user: User;

    @Column()
    userId: number;

    // Liên kết với Post (Bình luận thuộc bài viết nào)
    @ManyToOne(() => Post, (post) => post.comments, { onDelete: 'CASCADE' }) // Xóa bài -> xóa luôn comment
    @JoinColumn({ name: 'postId' })
    post: Post;
    @Column()
    postId: number;
}