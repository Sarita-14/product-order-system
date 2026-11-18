import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { decimalTransformer } from '../../../common/transformers/decimal.transformer';
import { Product } from '../../products/entities/product.entity';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id', type: 'uuid' })
  orderId: string;

  @Column({ name: 'product_id', type: 'uuid' })
  productId: string;

  @Column({ type: 'integer' })
  quantity: number;

  /** Price copied at order time; later product price changes don't affect this order */
  @Column({ name: 'unit_price', type: 'numeric', precision: 10, scale: 2, transformer: decimalTransformer })
  unitPrice: number;

  @Column({ type: 'numeric', precision: 10, scale: 2, transformer: decimalTransformer })
  subtotal: number;

  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'order_id' })
  order: Order;

  @ManyToOne(() => Product, (product) => product.orderItems, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}