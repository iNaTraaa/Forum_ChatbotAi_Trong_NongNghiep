import { Get, HttpException, HttpStatus, Injectable, UseGuards } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { In, Repository } from 'typeorm';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';
import { console } from 'inspector';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerUserDto: RegisterUserDto): Promise<any> {
        const existingUser = await this.userRepository.findOne({
            where: { email: registerUserDto.email },
        });

        if (existingUser) {
            throw new HttpException('Email đã tồn tại. Vui lòng sử dụng email khác.', HttpStatus.BAD_REQUEST);
        }

        // Hash mật khẩu trước khi lưu
        const hashedPassword = await bcrypt.hash(registerUserDto.password, 10);
        const newUser = this.userRepository.create({
            ...registerUserDto,
            password: hashedPassword,
        });
        const savedUser = await this.userRepository.save(newUser);

        const payload = { id: savedUser.id, email: savedUser.email };
        return this.generateToken(payload);
    }

    async login(loginUserDto: LoginUserDto): Promise<any> {
        // Tìm người dùng bằng email
        const user = await this.userRepository.findOne({
            where: { email: loginUserDto.email },
        });

        // Nếu không tìm thấy, báo lỗi
        if (!user) {
            throw new HttpException('Email hoặc mật khẩu không chính xác', HttpStatus.UNAUTHORIZED);
        }

        // So sánh mật khẩu người dùng nhập vào với mật khẩu đã hash trong DB
        const isPasswordValid = await bcrypt.compare(loginUserDto.password, user.password);

        // Nếu mật khẩu sai, báo lỗi
        if (!isPasswordValid) {
            throw new HttpException('Email hoặc mật khẩu không chính xác', HttpStatus.UNAUTHORIZED);
        }

        // Tạo một đối tượng mới 'userInfo' chứa tất cả các trường của 'user'
        // ngoại trừ 'password' và 'refresh_token' để gửi về cho client một cách an toàn.
        const { password, refresh_token, ...userInfo } = user;

        // Tạo payload (dữ liệu cốt lõi) để mã hóa thành JWT
        const payload = { id: user.id, email: user.email, role: user.role };

        // Gọi hàm generateToken để tạo access_token và refresh_token mới
        const tokens = await this.generateToken(payload);

        // Trả về một object chứa cả hai token và thông tin người dùng đã được làm sạch
        return {
            ...tokens,      // Bao gồm { access_token: "...", refresh_token: "..." }
            user: userInfo  // Bao gồm { id: 1, email: "...", name: "..." }
        };
    }
    async refreshToken(refresh_token: string): Promise<any> {
        try {
            const verify = await this.jwtService.verifyAsync(refresh_token, {
                secret: this.configService.get<string>('SECRET'),
            });
            const checkExistToken = await this.userRepository.findOne({
                where: { email: verify.email, refresh_token: refresh_token },
            });
            if (checkExistToken) {
                return this.generateToken({ id: verify.id, email: verify.email });
            } else {
                throw new HttpException('Refresh token is invalid', HttpStatus.UNAUTHORIZED);
            }
        } catch (error) {
            throw new HttpException('Refresh token is invalid', HttpStatus.UNAUTHORIZED);
        }
    }

    private async generateToken(payload: { id: number; email: string }) {
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get<string>('SECRET'),
            expiresIn: this.configService.get<string>('EXPIRES_IN_REFRESH_TOKEN'),
        });
        await this.userRepository.update(
            { email: payload.email },
            { refresh_token: refresh_token },
        );
        return { access_token, refresh_token };
    }
}

