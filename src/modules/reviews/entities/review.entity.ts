// FILE: review.entity.ts — describes the "reviews" table (one customer's review of one product).
// TypeORM decorators used below
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
import { Product } from '../../products/entities/product.entity';

@Entity('reviews') 
@Check('CHK_reviews_rating_range', '"rating" BETWEEN 1 AND 5') 
@Unique('UQ_reviews_user_product', ['userId', 'productId']) 
export class Review {
  @PrimaryGeneratedColumn('uuid') 
  id: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({ name: 'reviewer_name', type: 'varchar', length: 255 })
  reviewerName: string;

  @Column({ type: 'smallint' })
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' }) // the link is stored in product_id
  product: Product;
}
