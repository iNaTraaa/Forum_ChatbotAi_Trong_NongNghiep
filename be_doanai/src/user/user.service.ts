import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { createUserDto } from './dto/create-user.dto';
import { updateUserDto } from './dto/update-user.dto';
import { UpdateResult } from 'typeorm/browser';
import { DeleteResult } from 'typeorm/browser';

@Injectable()
export class UserService {
    constructor(@InjectRepository(User) private userRepository: Repository<User>) { }
    async findAll(): Promise<User[]> {
        return await this.userRepository.find({
            select: ['id', 'email', 'first_Name', 'last_Name', 'status']
        });
    }

    async findOne(id: number): Promise<User | null> {
        return await this.userRepository.findOne({ where: { id } });
    }

    async create(createUserDto: createUserDto): Promise<User> {
        const user = this.userRepository.create(createUserDto);
        return await this.userRepository.save(user);
    }

    async update(id:number, updateUserDto: updateUserDto):Promise<UpdateResult>{
        return await this.userRepository.update(id, updateUserDto)
    }

    async delete(id:number):Promise<DeleteResult>{
        return await this.userRepository.delete(id);
    }

    async updateAvatar(id:number , avatar:string):Promise<UpdateResult>{
       return await this.userRepository.update(id, { avatar });
    }
}
