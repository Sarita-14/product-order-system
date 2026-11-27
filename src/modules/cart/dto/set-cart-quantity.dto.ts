// ─────────────────────────────────────────────────────────────────────────────
// FILE: set-cart-quantity.dto.ts — body of PATCH /cart/items/:productId.
// The new quantity for that product; 0 removes it from the cart.
// (Plain // comments, not /** */: the Swagger plugin turns JSDoc into API docs.)
// ─────────────────────────────────────────────────────────────────────────────

// The checks; a wrong body gets a 400 before our code runs.
import { IsInt, Max, Min } from 'class-validator';

export class SetCartQuantityDto {
  // A whole number from 0 (= remove) to 999.
  // @example 2
  @IsInt()
  @Min(0)
  @Max(999)
  quantity: number;
}
