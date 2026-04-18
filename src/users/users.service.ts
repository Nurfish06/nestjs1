import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

    private users = [
        { id: 1, name: 'Nura' },
        { id: 2, name: 'Nuru' },
    ];

    findAll() {
        return this.users;
    }

    create(userData: CreateUserDto) {
        const newUser = {
            id: this.users.length + 1,
            ...userData,
        };

        this.users.push(newUser);
        return newUser;
    }

    update(id: number, name: string) {
        const user = this.users.find(u => u.id === id);

        if (!user) {
            return { message: 'User not found' };
        }

        user.name = name;
        return user;
    }

    remove(id: number) {
        const user = this.users.find(u => u.id === id);

        if (!user) {
            return { message: 'User not found' };
        }

        this.users = this.users.filter(u => u.id !== id);
        return { message: 'User deleted' };
    }

}