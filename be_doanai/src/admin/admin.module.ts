import { Module } from '@nestjs/common'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { Post } from '../post/entities/post.entity';
import { User } from '../user/entities/user.entity';
import { Traffic } from './entities/traffic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Post, Traffic]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService]
})
export class AdminModule { }