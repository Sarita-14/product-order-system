// ─────────────────────────────────────────────────────────────────────────────
// FILE: update-user-role.dto.ts — body of PATCH /users/:id/role (admin only).
// (Plain // comments, not /** */: the Swagger plugin turns JSDoc into API docs.)
// ─────────────────────────────────────────────────────────────────────────────

// IsEnum = the value must be one of the Role list; anything else -> 400 before our code runs.
import { IsEnum } from 'class-validator';
// The list of roles.
import { Role } from '../enums/role.enum';

export class UpdateUserRoleDto {
  // The new role: "admin" or "customer".
  // @example "admin"
  @IsEnum(Role)
  role: Role;
}
