import { plainToInstance } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  validateSync,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment = Environment.Development;

  @IsInt()
  PORT: number = 3000;

  @IsString()
  APP_HOST: string = 'localhost';

  @IsString()
  SWAGGER_PATH: string = 'api/v1/docs';

  @IsString()
  DB_HOST: string;

  @IsInt()
  DB_PORT: number;

  @IsString()
  DB_USERNAME: string;

  @IsString()
  DB_PASSWORD: string;

  @IsString()
  DB_NAME: string;

  @IsString()
  RESEND_API_KEY: string;

  @IsOptional()
  @IsEmail()
  EMAIL_FROM: string = 'onboarding@resend.dev';

  // ---------- Auth (JWT) ----------
  // Secret used to sign tokens. Keep it long and random, never commit it.
  @IsString()
  @IsNotEmpty()
  JWT_SECRET: string;

  // How long a token stays valid, e.g. "15m", "1h", "1d"
  @IsString()
  JWT_EXPIRES_IN: string = '1d';

  // The Next.js app allowed to call this API from the browser (CORS)
  @IsString()
  FRONTEND_URL: string = 'http://localhost:3001';

  // ---------- Payments (Razorpay) ----------
  // Both come from the Razorpay dashboard: Settings -> API Keys (use "Test mode" keys while learning).
  // Optional: without them the app still starts; only the Pay button answers "not configured".
  // KEY_ID is public (the browser needs it to open the checkout); KEY_SECRET must stay on the server.
  @IsOptional()
  @IsString()
  RAZORPAY_KEY_ID?: string;

  @IsOptional()
  @IsString()
  RAZORPAY_KEY_SECRET?: string;

  // The secret YOU type when creating the webhook (Razorpay dashboard: Settings -> Webhooks).
  // Optional: without it the webhook route answers 503; the normal Pay flow still works.
  @IsOptional()
  @IsString()
  RAZORPAY_WEBHOOK_SECRET?: string;
}

export function validate(config: Record<string, unknown>) {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validated);

  if (errors.length > 0) {
    const details = errors.flatMap((e) => Object.values(e.constraints ?? {}));
    throw new Error(
      `Invalid environment variables:\n- ${details.join('\n- ')}`,
    );
  }
  return validated;
}