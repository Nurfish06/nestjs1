import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {

    constructor(private prisma: PrismaService) { }

    findAll() {
        return this.prisma.user.findMany();
    }

    async create(data: CreateUserDto) {
        try {
            const hashedPassword = await bcrypt.hash(data.password, 10);
            return await this.prisma.user.create({
                data: {
                    ...data,
                    password: hashedPassword,
                },
            });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('User with this name already exists');
            }
            throw error;
        }
    }

    update(id: number, name: string) {
        return this.prisma.user.update({
            where: { id },
            data: { name },
        });
    }

    remove(id: number) {
        return this.prisma.user.delete({
            where: { id },
        });
    }
}