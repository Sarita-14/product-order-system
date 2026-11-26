import { Body, Controller, Get, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
import { User } from '../../users/entities/user.entity';
import { CurrentUser } from '../decorators/current-user.decorator';
import { Public } from '../decorators/public.decorator';
import { LoginResponseDto } from '../dto/login-response.dto';
import { LoginDto } from '../dto/login.dto';
import { RegisterDto } from '../dto/register.dto';
import type { JwtPayload } from '../interfaces/jwt-payload.interface';
import { AuthService } from '../services/auth.service';

@ApiTags('Auth')
@ApiInternalServerErrorResponse({ description: 'Unexpected server error', type: ErrorResponseDto })
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @ApiOperation({ summary: 'Create an account (a user with a password)' })
  @ApiCreatedResponse({ description: 'Account created; user returned inside data', type: User })
  @ApiBadRequestResponse({ description: 'Validation failed (e.g. password shorter than 6)', type: ErrorResponseDto })
  @ApiConflictResponse({ description: 'Username, email or phone number already exists', type: ErrorResponseDto })
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK) // POST defaults to 201, but login creates nothing
  @ApiOperation({ summary: 'Log in and get a JWT access token' })
  @ApiOkResponse({ description: 'Token and user returned inside data', type: LoginResponseDto })
  @ApiUnauthorizedResponse({ description: 'Invalid email or password', type: ErrorResponseDto })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Get('me')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'The logged-in user (from the token)' })
  @ApiOkResponse({ description: 'The user; returned inside data', type: User })
  @ApiUnauthorizedResponse({ description: 'Missing, invalid or expired token', type: ErrorResponseDto })
  me(@CurrentUser() user: JwtPayload) {
    return this.authService.me(user.sub);
  }
}