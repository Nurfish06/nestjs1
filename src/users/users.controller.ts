import { Controller, Get, Post, Body, Patch, Delete, Param } from '@nestjs/common';
import { UsersService } from './users.service'
import { CreateUserDto } from './dto/create-user.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';

@Controller('/api/users')
export class UsersController {

    //Dependency Injection
    constructor(private readonly usersService: UsersService) { }
    @UseGuards(JwtAuthGuard)
    @Get()
    getAllUsers() {
        return this.usersService.findAll();
    }

    @Post()
    createUser(@Body() userData: CreateUserDto) {
        return this.usersService.create(userData);
    }
    @UseGuards(JwtAuthGuard)
    @Patch(':id')
    updateUser(
        @Param('id') id: string,
        @Body() body: CreateUserDto
    ) {
        return this.usersService.update(Number(id), body.name);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('admin')
    @Delete(':id')
    deleteUser(@Param('id') id: string) {
        return this.usersService.remove(Number(id));
    }
}