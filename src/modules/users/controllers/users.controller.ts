import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { CreateUserDto } from '../dto/create-user.dto';
import { User } from '../entities/user.entity';
import { UsersService } from '../services/users.service';

@ApiTags('Users')
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({ summary: 'Create a user (customer)' })
  @ApiCreatedResponse({ description: 'User created; returned inside data', type: User })
  @ApiBadRequestResponse({ description: 'Validation failed (e.g. invalid email, empty username)', type: ErrorResponseDto })
  @ApiConflictResponse({ description: 'Username, email or phone number already exists', type: ErrorResponseDto })
  create(@Body() dto: CreateUserDto) {
    return this.usersService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'List all users, newest first' })
  @ApiOkResponse({ description: 'List of users; returned inside data', type: [User] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one user by id' })
  @ApiParam({ name: 'id', description: 'User id (UUID)', example: '4f1c2b8d-cd19-4300-9cf9-23e15b745aaa' })
  @ApiOkResponse({ description: 'The user; returned inside data', type: User })
  @ApiBadRequestResponse({ description: 'id is not a valid UUID', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No user with this id', type: ErrorResponseDto })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }
}