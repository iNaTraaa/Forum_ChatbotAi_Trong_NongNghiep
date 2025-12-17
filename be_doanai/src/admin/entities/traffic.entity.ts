import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Traffic {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'date', unique: true }) // Mỗi ngày chỉ có 1 dòng record
    date: string; // Format: YYYY-MM-DD

    @Column({ default: 0 })
    visitors: number; // Số khách truy cập (Unique)

    @Column({ default: 0 })
    pageViews: number; // Tổng số lượt xem trang

    @CreateDateColumn()
    createdAt: Date;
}