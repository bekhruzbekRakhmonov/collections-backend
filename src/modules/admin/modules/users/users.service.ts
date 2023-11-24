import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { PaginationResponse } from 'src/common/pagination/pagination-response.dto';
import { PaginationDto } from 'src/common/pagination/pagination.dto';
import { CreateUserDto } from 'src/modules/users/dto/create-user.dto';
import { UpdateUserDto } from 'src/modules/users/dto/update-user.dto';
import { User } from 'src/modules/users/entities/user.entity';

@Injectable()
export class AdminUsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    async create(createUserDto: CreateUserDto): Promise<User | Error> {
        const isExist = await this.findByUsername(createUserDto.email);

        if (isExist) {
            throw Error('Already user registered with this email');
        }
        const { password, ...rest } = createUserDto;
        const hashedPassword = await this.hashPassword(password);
        const newUser = this.userRepository.create({
            password: hashedPassword,
            ...rest,
        });
        return await this.userRepository.save(newUser);
    }

    async hashPassword(password: string): Promise<string> {
        const saltRounds = 8;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        return hashedPassword;
    }

    async findAll(query: PaginationDto): Promise<PaginationResponse> {
        const total = await this.userRepository.count();
        const result = await this.userRepository.find({
            order: {
                [query?.orderBy || 'id']: query?.order || 'asc',
            },
            skip: (query?.limit || 10) * ((query?.page || 1) - 1),
            take: query?.limit || 10,
        });

        return {
            result,
            total,
            limit: Number(query?.limit || 10),
            page: Number(query?.page || 1),
        };
    }

    async findOne(id: number, detail = false): Promise<User> {
        return await this.userRepository.findOne({
            where: { id: id },
        });
    }

    async findByUsername(email: string): Promise<User> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const { name, email, status, role } = updateUserDto;
        const user = await this.userRepository.findOne({ where: { id } });
        user.name = name;
        user.email = email;
        user.status = status;
        user.role = role;
        return await this.userRepository.save(user);
    }

    async remove(id: number): Promise<User> {
        const user = await this.userRepository.findOne({
            where: {
                id,
                status: 'active',
            },
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }

        return await this.userRepository.remove(user);
    }

    async removeRefreshToken(userId: number): Promise<UpdateResult> {
        return await this.userRepository.update(userId, {
            id: userId,
        });
    }
}
