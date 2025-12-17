import {
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Comment } from 'src/comment/entities/comment.entity';
import { Vote } from './vote.entity';

@Entity('posts')
export class Post {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ nullable: true })
    thumbnail: string;

    @Column({ type: 'int', default: 1 })
    status: number;

    @Column({ type: 'int', default: 0 })
    score: number;

    @Column({ type: 'int', default: 0 })
    likeCount: number;

    @Column({ type: 'int', default: 0 })
    dislikeCount: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => User, (user) => user.posts, { eager: true, onDelete: 'CASCADE' })
    user: User;

    @OneToMany(() => Comment, (comment) => comment.post, { cascade: true })
    comments: Comment[];

    @OneToMany(() => Vote, (vote) => vote.post)
    votes: Vote[];
}