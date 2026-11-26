// What we put inside the token when signing it, and what the guard
// attaches to req.user after verifying it.
// sub ("subject") is the standard JWT field for "who this token belongs to".
export interface JwtPayload {
  sub: string; // user id
  email: string;
  username: string;
}