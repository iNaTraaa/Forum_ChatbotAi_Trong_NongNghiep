import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(request);

        // Nếu không có token, vẫn cho phép truy cập (như khách vãng lai)
        if (!token) {
            return true;
        }

        try {
            // Nếu có token, cố gắng xác thực để lấy thông tin user
            const payload = await this.jwtService.verifyAsync(token, {
                secret: this.configService.get<string>('SECRET'), // Đảm bảo key này khớp với biến môi trường của bạn
            });

            // Gán thông tin user vào request để Controller sử dụng
            request['user_data'] = payload;
        } catch {
            // Nếu token lỗi hoặc hết hạn, vẫn cho qua nhưng không gán user_data
            // (Người dùng sẽ được coi như khách)
        }

        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [type, token] = request.headers.authorization?.split(' ') ?? [];
        return type === 'Bearer' ? token : undefined;
    }
}