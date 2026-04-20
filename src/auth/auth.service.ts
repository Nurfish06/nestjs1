import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async register(name: string, password: string) {
        const hashedPassword = await bcrypt.hash(password, 10);

        return this.prisma.user.create({
            data: {
                name,
                password: hashedPassword,
            },
        });
    }

    async login(name: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { name } });

        if (!user) {
            throw new Error('User not found');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new Error('Invalid password');
        }

        const token = this.jwtService.sign({ id: user.id });

        return { token };
    }
}