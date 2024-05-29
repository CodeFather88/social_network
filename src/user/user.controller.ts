import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common'
import { UserService } from './user.service'
import { CreateUserDto } from './dto/createUser.dto'
import { GetOneUserDto } from './dto/getOneUser.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { DeleteUserDto } from './dto/deleteUser.dto';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({ summary: 'Create user' })
  @Post()
  async createUser(@Body() dto: CreateUserDto) {
    return await this.userService.create(dto)
  }

  @ApiOperation({ summary: 'get one user' })
  @Get(':id')
  async getOneUser(@Param() dto: GetOneUserDto) {
    return await this.userService.findOne(dto.id);
  }

  @ApiOperation({ summary: 'Delete user' })
  @Delete(':id')
  async deleteUser(@Param() dto: DeleteUserDto) {
    return await this.userService.delete(dto.id)
  }
}
