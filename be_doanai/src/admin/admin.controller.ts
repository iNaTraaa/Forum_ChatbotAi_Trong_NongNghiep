import { Controller, Get, Delete, Patch, Param, Body, Query, ParseIntPipe } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
    constructor(private readonly adminService: AdminService) { }
    @Get('log-traffic')
    logTraffic() {
        return this.adminService.logTraffic();
    }

    @Get('stats')
    getStats(@Query('period') period: string = 'week') {
        return this.adminService.getStats(period);
    }

    @Get('users')
    getUsers() {
        return this.adminService.getAllUsers();
    }

    @Delete('users/:id')
    deleteUser(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.deleteUser(id);
    }

    @Patch('users/:id/role')
    updateUserRole(
        @Param('id', ParseIntPipe) id: number,
        @Body('role') role: string
    ) {
        return this.adminService.updateUserRole(id, role);
    }

    @Get('posts')
    getPosts() {
        return this.adminService.getAllPosts();
    }

    @Delete('posts/:id')
    deletePost(@Param('id', ParseIntPipe) id: number) {
        return this.adminService.deletePost(id);
    }
}