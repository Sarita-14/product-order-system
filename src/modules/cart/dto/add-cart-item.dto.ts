// ─────────────────────────────────────────────────────────────────────────────
// FILE: add-cart-item.dto.ts — body of POST /cart/items (add ONE of a product).
// (Plain // comments, not /** */: the Swagger plugin turns JSDoc into API docs.)
// ─────────────────────────────────────────────────────────────────────────────

// IsUUID = must be a real id; a wrong body gets a 400 before our code runs.
import { IsUUID } from 'class-validator';

export class AddCartItemDto {
  // Which product to add one of.
  // @example "ca049d72-afbd-469e-9db7-6131ab3af876"
  @IsUUID()
  productId: string;
}
