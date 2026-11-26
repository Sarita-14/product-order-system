import { SetMetadata } from '@nestjs/common';

// The JWT guard runs on EVERY route (registered globally in AuthModule).
// Put @Public() on a route (or a whole controller) to let it through without a token.
export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);