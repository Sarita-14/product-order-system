// ─────────────────────────────────────────────────────────────────────────────
// FILE: role.enum.ts — the list of roles a user can have.
//
// CONCEPT — "enum": a fixed list of allowed values with names.
//   Instead of typing the text 'admin' everywhere (and maybe mistyping 'admn'),
//   we write Role.Admin. If we mistype Role.Admn, TypeScript refuses to compile,
//   so the mistake is caught before the app even runs.
//
// USED BY: user.entity.ts (the database column), jwt-payload.interface.ts
//   (inside the login token), roles.decorator.ts / roles.guard.ts (who may call a route).
// ─────────────────────────────────────────────────────────────────────────────

// "export" = other files may import this. "enum Role" = the list is called Role.
export enum Role {
  // Role.Customer stands for the text 'customer'.
  // That text is what gets SAVED in the database and put in the token,
  // so never rename the text without also writing a migration.
  Customer = 'customer', // default for everyone who registers
  // Role.Admin stands for the text 'admin'.
  Admin = 'admin', // can manage products, users and order status
}
