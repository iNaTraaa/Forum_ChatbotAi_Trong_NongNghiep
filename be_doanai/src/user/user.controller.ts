import { Body, Controller, Delete, Get, Param, Post, Put, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { User } from './entities/user.entity';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.gard';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm';
import { FileInterceptor } from '@nestjs/platform-express';
import { Multer } from 'multer';
import { storageConfig } from 'helpers/config';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) { }
    @UseGuards(AuthGuard)
    @Get()
    findAll(): Promise<User[]> {
        return this.userService.findAll();
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    findOne(@Param('id') id: string): Promise<User | null> {
        return this.userService.findOne(Number(id));
    }

    // Tạo User
    @Post()
    create(@Body() createUserDto: createUserDto): Promise<User> {
        return this.userService.create(createUserDto);
    }

    // Cập nhật User
    @UseGuards(AuthGuard)
    @Put(':id')
    update(@Param('id') id: string, @Body() updateUserDto: updateUserDto): Promise<UpdateResult> {
        return this.userService.update(Number(id), updateUserDto);
    }

    // Xóa User
    @UseGuards(AuthGuard)
    @Delete(':id')
    delete(@Param('id') id: string) {
        return this.userService.delete(Number(id));
    }

    // Xử lý upload avatar
    @Post('upload-avatar')
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('avatar', { storage: storageConfig('avatar') }))
    upLoadAvatar(@UploadedFile() file: Multer.File, @Req() req: Request) {
        console.log("upload avatar");
        console.log('user data ', req['user_data']);
        console.log(file);
        this.userService.updateAvatar(req['user_data'].id, file.destination + '/' + file.filename);

    }
}

