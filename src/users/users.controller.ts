import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto';

@Controller('/api/users')
export class UsersController {

    //Dependency Injection
    constructor(private readonly usersService: UsersService) { }

    @Get()
    getAllUsers() {
        return this.usersService.findAll();
    }

    @Post()
    createUser(@Body() userData: CreateUserDto) {
        return this.usersService.create(userData);
    }

    @Patch(':id')
    updateUser(
        @Param('id') id: string,
        @Body() body: CreateUserDto
    ) {
        return this.usersService.update(Number(id), body.name);
    }

    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.remove(Number(id));
    }
}