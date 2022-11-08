import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { BaseResultType } from 'src/common/type/base-result.type';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService){}

  @UseGuards(AuthGuard('jwt'))
  @Get('username/:username')
  async getUserByUsername(@Param('username') param) {
    const result = await this.userService.getUserByUsername(param);
    return BaseResultType.successResult({
      result,
      message: 'Get user by name success.'
    });
  }

  @Post('/register')
  async registerUser(@Body() createUserDto: CreateUserDto) {
    const result = await this.userService.registerUser(createUserDto);

    return BaseResultType.successResult({
      result,
      message: 'Register user success.'
    })
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/update')
  async updateUser(@Body() updateUserDto: UpdateUserDto) {
    const result = await this.userService.updateUser(updateUserDto);

    return BaseResultType.successResult({
      result,
      message: 'Update user data success.'
    })
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("/list")
  async findAll(@Param() param) {
    const result = await this.userService.findByAttribute(param, null);

    return BaseResultType.successResult({
      result,
      message: 'Find all user data success.'
    })
  }

  @UseGuards(AuthGuard('jwt'))
  @Get("/detail/:id")
  async findOne(@Param('id') param) {
    const result = await this.userService.findOneByAttribute({_id: param}, null);

    return BaseResultType.successResult({
      result,
      message: 'Find user data success.'
    })
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post("/delete/:id")
  async deleteUser(@Param('id') param) {
    const result = await this.userService.deleteUser(param);
  
    return BaseResultType.successResult({
      result,
      message: 'Delete user data success.'
    })
  }
}
