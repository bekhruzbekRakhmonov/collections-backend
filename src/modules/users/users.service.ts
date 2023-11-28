import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import { PaginationResponse } from 'src/common/pagination/pagination-response.dto';
import { Collection } from '../collections/entities/collection.entity';
import { Item } from '../items/entities/item.entity';
import { Like } from '../likes/entities/like.entity';
import { PaginationDto } from 'src/common/pagination/pagination.dto';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Collection)
        private readonly collectionRepo: Repository<Collection>,
        @InjectRepository(Item)
        private readonly itemRepo: Repository<Item>,
        @InjectRepository(Like)
        private readonly likeRepo: Repository<Like>

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

    async findAll(query?: PaginationDto): Promise<PaginationResponse> {
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

    async statistics(user_id: number): Promise<any> {
        const totalCollections = await this.collectionRepo.count({
            relations: {
                owner: true,
            },
            where: {
                owner: {
                    id: user_id
                }
            }
        })

        const items = await this.itemRepo.find({
            relations: {
                owner: true,
                likes: true,
            },
            where: {
                owner: {
                    id: user_id,
                },
            },
        });

        const total = {
            collections_count: totalCollections,
            items_count: 0,
            likes_count: 0
        }

        items.map((item) => {
            total.items_count += 1;
            total.likes_count += item.likes.length;
        })
        return total;
    }

    async findOne(id: number): Promise<User> {
        return await this.userRepository.findOne({
            where: { id: id },
        });
    }

    async findByUsername(email: string): Promise<User> {
        return await this.userRepository.findOne({ where: { email } });
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const { name, email, status, password, role } = updateUserDto;
        const user = await this.userRepository.findOne({ where: { id } });
        user.name = name;
        user.email = email;
        user.status = status;
        user.password = await this.hashPassword(password);
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
