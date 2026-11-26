// ─────────────────────────────────────────────────────────────────────────────
// FILE: auth.module.ts — puts all the auth pieces together.
//
// CONCEPT — "module": a box that groups related classes (controllers, services,
//   use cases...) and tells Nest how to build them. The app is made of modules.
//
// CONCEPT — "APP_GUARD": registers a guard for EVERY route of the whole app.
//   Secure by default: a new route is protected unless it is marked @Public().
// ─────────────────────────────────────────────────────────────────────────────

// Module = the decorator that turns a class into a module.
import { Module } from '@nestjs/common';
// ConfigService = reads values from the .env file.
import { ConfigService } from '@nestjs/config';
// APP_GUARD = the special name for "a guard for every route".
import { APP_GUARD } from '@nestjs/core';
// JwtModule = gives us JwtService. JwtSignOptions = its settings type.
import { JwtModule, JwtSignOptions } from '@nestjs/jwt';
// The users module (we need its UsersRepository / UsersService).
import { UsersModule } from '../users/users.module';
// The routes /auth/register, /auth/login, /auth/me.
import { AuthController } from './controllers/auth.controller';
// Guard 1: checks the token.
import { JwtAuthGuard } from './guards/jwt-auth.guard';
// Guard 2: checks the role.
import { RolesGuard } from './guards/roles.guard';
// The service the controller calls.
import { AuthService } from './services/auth.service';
// The two use cases.
import { LoginUseCase } from './usecases/login.usecase';
import { RegisterUseCase } from './usecases/register.usecase';

@Module({
  // imports = other modules whose exported classes we need.
  imports: [
    UsersModule,
    // registerAsync = set it up a moment later, after .env has been read, so we can use the secret from .env
    JwtModule.registerAsync({
      inject: [ConfigService], // hand the function below the .env reader (ConfigService)
      // useFactory = a function that returns the JWT settings.
      useFactory: (config: ConfigService) => ({
        // The secret used to sign/check tokens (from .env; crash at start if missing).
        secret: config.getOrThrow<string>('JWT_SECRET'),
        signOptions: {
          // How long a token lives, e.g. "1d" (from .env).
          expiresIn: config.getOrThrow<string>(
            'JWT_EXPIRES_IN',
          ) as JwtSignOptions['expiresIn'],
        },
      }),
    }),
  ],
  // controllers = classes that receive HTTP requests.
  controllers: [AuthController],
  // providers = classes Nest creates for us and hands to any class that asks for them.
  providers: [
    AuthService,
    RegisterUseCase,
    LoginUseCase,
    // APP_GUARD = run JwtAuthGuard on every route of the whole app.
    // Secure by default: a new route is protected unless it is marked @Public().
    { provide: APP_GUARD, useClass: JwtAuthGuard },
    // 2nd global guard, runs after JwtAuthGuard (so req.user is already set):
    // checks @Roles(...) / @AdminOnly() and answers 403 when the role doesn't match.
    { provide: APP_GUARD, useClass: RolesGuard },
  ],
})
// The module class itself is empty; the @Module settings above do the work.
export class AuthModule {}
