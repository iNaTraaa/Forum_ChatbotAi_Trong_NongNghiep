import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: "int", default: 1 })
  status: number;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;


}