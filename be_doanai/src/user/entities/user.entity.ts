
import { Post } from 'src/post/entities/post.entity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    USER = 'user',
}
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_Name: string;

    @Column()
    password: string;

    @Column()
    email: string;

    @Column({ nullable: true, default: null })
    refresh_token: string;

    @Column()
    last_Name: string;

    @Column({ default: 1 })
    status: number;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.USER // Mặc định đăng ký mới là 'user'
    })
    role: UserRole;

    @Column({ nullable: true, default: null })
    avatar: string;

    @OneToMany(() => Post, (post) => post.user)
    posts: Post[];


}
