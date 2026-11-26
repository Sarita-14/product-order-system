// ─────────────────────────────────────────────────────────────────────────────
// FILE: users.controller.ts — the HTTP routes under /api/v1/users.
//
// CONCEPT — "controller": the front door of the backend. It receives an HTTP
//   request (e.g. GET /users), reads what is needed from it, and hands the work
//   to a SERVICE. It contains no business logic itself.
//   Our layers: controller -> service -> usecase -> repository -> database.
//
// ADMIN ONLY: @AdminOnly() on the class = every route here needs an admin token.
// ─────────────────────────────────────────────────────────────────────────────

// Nest decorators: @Controller (a class of routes), @Get/@Post (route methods),
// @Body (the JSON sent), @Param (a piece of the URL), ParseUUIDPipe (checks the id has the right format).
import { Body, Controller, Get, Param, ParseUUIDPipe, Post } from '@nestjs/common';
// Swagger decorators: they only DESCRIBE the routes on the docs page (/api/v1/docs).
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
// The shape of our error responses (for the docs).
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
// Our decorator: "only admins may call this" (see roles.decorator.ts).
import { AdminOnly } from '../../auth/decorators/roles.decorator';
// The rules for the JSON body when creating a user.
import { CreateUserDto } from '../dto/create-user.dto';
// The User entity (used as the response type in the docs).
import { User } from '../entities/user.entity';
// The service that does the actual work.
import { UsersService } from '../services/users.service';

@ApiTags('Users') // group these routes under "Users" in the docs
@ApiBearerAuth() // every route here needs a token...
@AdminOnly() // ...and the user must be an admin
// docs: what a 401 (no/bad token) answer looks like
@ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token', type: ErrorResponseDto })
// docs: what a 500 (server crash) answer looks like
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller('users') // all routes in this class start with /users
export class UsersController {
  // CONCEPT — "dependency injection": we don't write `new UsersService()`.
  // We just ask for it in the constructor, and Nest gives us the one shared copy that the whole app uses.
  constructor(private readonly usersService: UsersService) {}

  @Post() // POST /users
  @ApiOperation({ summary: 'Create a user (customer)' })
  @ApiCreatedResponse({ description: 'User created; returned inside data', type: User })
  @ApiBadRequestResponse({ description: 'Validation failed (e.g. invalid email, empty username)', type: ErrorResponseDto })
  @ApiConflictResponse({ description: 'Username, email or phone number already exists', type: ErrorResponseDto })
  // @Body() dto = the JSON the caller sent, already checked against CreateUserDto's rules.
  create(@Body() dto: CreateUserDto) {
    // Hand the work to the service and return its result (Nest turns it into JSON).
    return this.usersService.create(dto);
  }

  @Get() // GET /users
  @ApiOperation({ summary: 'List all users, newest first' })
  @ApiOkResponse({ description: 'List of users; returned inside data', type: [User] })
  findAll() {
    // Ask the service for every user.
    return this.usersService.findAll();
  }

  @Get(':id') // GET /users/<some id>   (":id" = a placeholder for the id in the URL)
  @ApiOperation({ summary: 'Get one user by id' })
  @ApiParam({ name: 'id', description: 'User id (UUID)', example: '4f1c2b8d-cd19-4300-9cf9-23e15b745aaa' })
  @ApiOkResponse({ description: 'The user; returned inside data', type: User })
  @ApiBadRequestResponse({ description: 'id is not a valid UUID', type: ErrorResponseDto })
  @ApiNotFoundResponse({ description: 'No user with this id', type: ErrorResponseDto })
  // @Param('id', ParseUUIDPipe) = take "id" from the URL and reject it (400) if the id doesn't have the right format.
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    // Ask the service for that one user (it answers 404 if not found).
    return this.usersService.findOne(id);
  }
}
