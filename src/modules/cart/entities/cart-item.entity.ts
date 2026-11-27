// ─────────────────────────────────────────────────────────────────────────────
// FILE: cart-item.entity.ts — describes the "cart_items" table (one line of a cart).
// (What an entity and a decorator are: see users/entities/user.entity.ts.)
//
// The quantity here is RESERVED stock: when it goes up, products.stock_quantity
// goes down by the same amount (and back up when it goes down). See change-cart.usecase.ts.
// ─────────────────────────────────────────────────────────────────────────────

// TypeORM decorators used below.
import {
  Check,
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
// A cart line points to one product.
import { Product } from '../../products/entities/product.entity';

@Entity('cart_items') // this class = the "cart_items" table
@Check('CHK_cart_items_quantity_positive', '"quantity" > 0') // same rules as the migration
@Unique('UQ_cart_items_user_product', ['userId', 'productId'])
export class CartItem {
  @PrimaryGeneratedColumn('uuid') // unique id, created by the database
  id: string;

  // Whose cart (column user_id). Taken from the login token, never from the browser.
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  // Which product (column product_id).
  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  // How many (always 1 or more).
  @Column({ type: 'integer' })
  quantity: number;

  // Filled in / updated by the database.
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // @ManyToOne = many cart lines can point to the same product (in different carts).
  @ManyToOne(() => Product, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' }) // the link is stored in product_id
  product: Product;
}
