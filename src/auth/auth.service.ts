import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async register(name: string, password: string) {
        try {
            const hashedPassword = await bcrypt.hash(password, 10);
            return await this.prisma.user.create({
                data: {
                    name,
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

    async login(name: string, password: string) {
        const user = await this.prisma.user.findUnique({ where: { name } });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const token = this.jwtService.sign({ id: user.id });

        return { token };
    }
}