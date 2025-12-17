import { Controller, Get, Post, Body, Param, Delete, UseGuards, Req, ParseIntPipe } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AuthGuard } from 'src/auth/auth.gard'; 
import { Request } from 'express';
import { User } from 'src/user/entities/user.entity';

interface RequestWithUser extends Request {
  user_data: User;
}
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) { }

  // API: POST /comment (Tạo comment)
  @Post()
  @UseGuards(AuthGuard)
  create(@Req() req: RequestWithUser, @Body() createCommentDto: CreateCommentDto) {
    return this.commentService.create(req.user_data.id, createCommentDto);
  }

  // API: GET /comment/post/:postId (Lấy list comment của 1 bài)
  @Get('post/:postId')
  findAllByPost(@Param('postId', ParseIntPipe) postId: number) {
    return this.commentService.findByPostId(postId);
  }

  // API: DELETE /comment/:id (Xóa comment)
  @Delete(':id')
  @UseGuards(AuthGuard)
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: RequestWithUser) {
    return this.commentService.remove(id, req.user_data.id);
  }
}