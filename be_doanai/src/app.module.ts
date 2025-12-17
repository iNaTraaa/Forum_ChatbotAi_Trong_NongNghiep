
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user/entities/user.entity';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './category/category.module';
import { Category } from './category/entitties/category.entity';
import { PostModule } from './post/post.module';
import { Post } from './post/entities/post.entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { CommentModule } from './comment/comment.module';
import { Comment } from './comment/entities/comment.entity';
import { Vote } from './post/entities/vote.entity';
import { AdminModule } from './admin/admin.module';
import { Admin } from 'typeorm';
import { Traffic } from './admin/entities/traffic.entity';
@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'doanaidb',
      entities: [User, Category, Post, Comment, Vote, Admin, Traffic],
      synchronize: true,
      extra: {
        authPlugin: 'mysql_native_password',
      },
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
    }),

    UserModule,
    AuthModule,
    PostModule,
    CategoryModule,
    CommentModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }