import {
    Body,
    Controller,
    Req,
    UseGuards,
    UseInterceptors,
    Post,
    UploadedFile,
    UnauthorizedException,
    Get,
    Delete,
    Param,
    ParseIntPipe
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { storageConfig } from 'helpers/config';
import { PostService } from './post.service';
import { VoteDto } from './dto/vote-post.dto';
import { Request } from 'express';
import * as multer from 'multer'; 
import { AuthGuard } from '../auth/auth.gard'; 
import { OptionalAuthGuard } from '../auth/optional-auth.guard';
import { User } from '../user/entities/user.entity'; 
interface RequestWithUserData extends Request {
    user_data?: User & { sub?: number };
}
@Controller('post')
export class PostController {
    constructor(private postService: PostService) { }
    // Tạo bài viết
    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('thumbnail', { storage: storageConfig('post') }))
    async create(
        @Req() req: RequestWithUserData,
        @Body() createPostDto: CreatePostDto,
        @UploadedFile() file?: multer.File
    ) {
        const user = req.user_data;
        const userId = user ? (user.id || user.sub) : undefined;

        console.log('User Creating Post:', user);

        if (!userId) {
            throw new UnauthorizedException('Không thể xác định người dùng. Token có thể không hợp lệ.');
        }

        return this.postService.create(userId, createPostDto, file);
    }

    // Lấy danh sách bài viết
    @Get()
    @UseGuards(OptionalAuthGuard)
    async findAll(@Req() req: RequestWithUserData) {
        console.log("=== API GET POSTS ===");
        console.log("Token Data:", req.user_data);

        let userId: number | undefined = undefined;
        if (req.user_data) {
            userId = req.user_data.id || req.user_data.sub;
        }

        console.log("UserID dùng để check vote:", userId);

        return this.postService.findAll(userId);
    }
    // Lấy chi tiết một bài viết
    @Get(':id')
    @UseGuards(OptionalAuthGuard)
    async findOne(
        @Param('id', ParseIntPipe) id: number,
        @Req() req: RequestWithUserData
    ) {
        let userId: number | undefined = undefined;
        if (req.user_data) {
            userId = req.user_data.id || req.user_data.sub;
        }

        return this.postService.findOne(id, userId);
    }

    // Xóa tất cả bài viết (DÙNG CHO MỤC ĐÍCH TEST)
    @Delete()
    @UseGuards(AuthGuard)
    deleteAllPosts() {
        console.log('Một yêu cầu xóa tất cả bài viết đã được thực hiện.');
        return this.postService.deleteAll();
    }

    // Vote
    @Post(':id/vote')
    @UseGuards(AuthGuard)
    vote(
        @Param('id', ParseIntPipe) postId: number,
        @Body() voteDto: VoteDto,
        @Req() req: RequestWithUserData,
    ) {
        const user = req.user_data;
        const userId = user ? (user.id || user.sub) : undefined;

        if (!userId) {
            throw new UnauthorizedException('Bạn cần đăng nhập để thực hiện hành động này.');
        }

        return this.postService.voteOnPost(userId, postId, voteDto);
    }
}