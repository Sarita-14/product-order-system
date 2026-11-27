// ─────────────────────────────────────────────────────────────────────────────
// FILE: order.entity.ts — describes the "orders" table.
// (What an entity and a decorator are: see users/entities/user.entity.ts.)
// ─────────────────────────────────────────────────────────────────────────────

// TypeORM decorators used below.
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// Converts Postgres "numeric" (which arrives as text) into a JavaScript number.
import { decimalTransformer } from '../../../common/transformers/decimal.transformer';
// The User entity (an order belongs to one user).
import { User } from '../../users/entities/user.entity';
// The list of statuses.
import { OrderStatus } from '../enums/order-status.enum';
// The OrderItem entity (an order has many items).
import { OrderItem } from './order-item.entity';

@Entity('orders') // this class = the "orders" table
export class Order {
  @PrimaryGeneratedColumn('uuid') // unique id, created by the database
  id: string;

  // The id of the user who placed the order (column user_id).
  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  /** Copied at order time, so later profile edits don't change old orders */
  @Column({ name: 'customer_name', type: 'varchar', length: 255 })
  customerName: string;

  // The customer's email at order time (also copied at order time).
  @Column({ name: 'customer_email', type: 'varchar', length: 255 })
  customerEmail: string;

  // The order total: a number with up to 10 digits, 2 after the dot (e.g. 12345678.90).
  @Column({
    name: 'total_amount',
    type: 'numeric',
    precision: 10,
    scale: 2,
    transformer: decimalTransformer, // text from the database -> number in our code
  })
  totalAmount: number;

  // The status column: only values from OrderStatus are allowed.
  @Column({
    type: 'enum',
    enum: OrderStatus,
    enumName: 'order_status_enum', // matches the type created by the first migration
    default: OrderStatus.PENDING, // a new order starts as PENDING (waiting for payment)
  })
  status: OrderStatus;

  // Razorpay's id for the payment attempt ("order_Abc123"), saved when the customer clicks Pay.
  // null = Pay was never clicked. (Column added by the AddOrderPayment migration.)
  @Column({ name: 'razorpay_order_id', type: 'varchar', length: 255, nullable: true })
  razorpayOrderId: string | null;

  // Razorpay's id of the successful payment ("pay_Xyz789"), saved once the payment is verified.
  // null = not paid (yet).
  @Column({ name: 'razorpay_payment_id', type: 'varchar', length: 255, nullable: true })
  razorpayPaymentId: string | null;

  // Filled in by the database when the row is created.
  @CreateDateColumn({ name: 'created_at', type: 'timestamp' })
  createdAt: Date;

  // Updated by the database whenever the row changes.
  @UpdateDateColumn({ name: 'updated_at', type: 'timestamp' })
  updatedAt: Date;

  // @ManyToOne = many orders belong to one user. RESTRICT = a user with orders can't be deleted.
  @ManyToOne(() => User, (user) => user.orders, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'user_id' }) // the link is stored in the user_id column
  user: User;

  // @OneToMany = one order has many items. cascade = saving the order also saves its items.
  @OneToMany(() => OrderItem, (item) => item.order, { cascade: true })
  items: OrderItem[];
}
