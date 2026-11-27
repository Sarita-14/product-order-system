// ─────────────────────────────────────────────────────────────────────────────
// FILE: roles.decorator.ts — @Roles(...), @AdminOnly() and @CustomerOnly().
//
// @Roles(Role.Admin) on a route (or a whole controller) = only these roles may call it.
// RolesGuard reads this list. No @Roles = any logged-in user is fine.
// (Sticky-note "metadata" idea: see public.decorator.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// applyDecorators = combine several decorators into one. SetMetadata = attach a sticky note.
import { applyDecorators, SetMetadata } from '@nestjs/common';
// Swagger decorator documenting the "403 Forbidden" answer.
import { ApiForbiddenResponse } from '@nestjs/swagger';
// The shape of our error answers (for the docs).
import { ErrorResponseDto } from '../../../common/dto/error-response.dto';
// The list of roles.
import { Role } from '../../users/enums/role.enum';

// The sticky note's name. Exported so RolesGuard reads the SAME name.
export const ROLES_KEY = 'roles';
// Roles(...roles): "...roles" collects any number of arguments into an array,
// e.g. Roles(Role.Admin) -> ['admin']. That array is written on the sticky note.
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// Shortcut used everywhere admin-only: the rule + its Swagger 403 docs in one decorator,
// so the same pair of lines is never repeated on each route.
export const AdminOnly = () =>
  applyDecorators(
    Roles(Role.Admin), // the rule: admins only
    ApiForbiddenResponse({ description: 'Admins only', type: ErrorResponseDto }), // the docs
  );

// The opposite shortcut: shopping actions (place an order, use the cart) are for customers.
// Admins manage the shop; they don't buy from it, so an admin token gets a 403 here.
export const CustomerOnly = () =>
  applyDecorators(
    Roles(Role.Customer), // the rule: customers only
    ApiForbiddenResponse({ description: 'Customers only', type: ErrorResponseDto }), // the docs
  );
