// ─────────────────────────────────────────────────────────────────────────────
// FILE: user.entity.ts — describes the "users" TABLE in PostgreSQL.
//
// CONCEPT — "entity": a TypeScript class that TypeORM (our database library)
//   maps to a database table. One object of this class = one row.
//   Each property marked with @Column = one column of the table.
//
// CONCEPT — "decorator": the lines starting with @ (like @Column) are
//   decorators. They attach extra information to the line below them.
//   Here they tell TypeORM "this property is a column, of this type".
//
// DATA COMES FROM: the database. TypeORM reads rows and turns them into User objects.
// ─────────────────────────────────────────────────────────────────────────────

// Tells Swagger (the API docs page) to hide a property from the docs.
import { ApiHideProperty } from '@nestjs/swagger';
// The TypeORM decorators we use below (each one explained where it is used).
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
// The Order entity: needed to say "one user has many orders".
import { Order } from '../../orders/entities/order.entity';
// Our list of roles (customer / admin).
import { Role } from '../enums/role.enum';

// @Entity('users') = this class is the table named "users".
@Entity('users')
// "export class User" = the blueprint of one user row; other files import it.
export class User {
  // @PrimaryGeneratedColumn('uuid') = the unique id of each row.
  // The DATABASE creates it automatically as a UUID (a long random id like "4f1c2b8d-...").
  // The "!" tells TypeScript "trust me, this will be filled in (by the database)".
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // A text column of at most 100 characters; unique = no two users may share it.
  @Column({ type: 'varchar', length: 100, unique: true })
  username!: string;

  // The email address; also unique.
  @Column({ type: 'varchar', length: 255, unique: true })
  email!: string;

  // In the database the column is called phone_number; in our code, phoneNumber.
  @Column({ name: 'phone_number', type: 'varchar', length: 20, unique: true })
  phoneNumber!: string;

  // bcrypt hash, never the plain password.
  // select: false -> left out of every normal query, so it never leaks in a response.
  // nullable (may be empty) -> customers created through POST /users have no login.
  @ApiHideProperty() // never show this field in the Swagger docs
  @Column({
    name: 'password_hash', // column name in the database
    type: 'varchar', // text
    length: 255, // at most 255 characters
    nullable: true, // the value may be empty (NULL)
    select: false, // NOT loaded unless a query asks for it on purpose (only login does)
  })
  // "?" = optional; "string | null" = either text or nothing.
  passwordHash?: string | null;

  // What the user is allowed to do. Everyone starts as a customer;
  // an admin is promoted by hand in the database (never through the API).
  @Column({
    type: 'enum', // the column may only hold values from a fixed list...
    enum: Role, // ...and this is that list ('customer', 'admin')
    enumName: 'user_role_enum', // the Postgres type created by the AddUserRole migration
    default: Role.Customer, // a new row without a role gets 'customer'
  })
  // The property in our code: holds Role.Customer or Role.Admin.
  role!: Role;

  // @CreateDateColumn = the database fills in the date/time when the row is created.
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  // @UpdateDateColumn = the database updates this date/time every time the row changes.
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  // @OneToMany = "one user has many orders". Not a column in this table:
  // each order row stores the user's id, and TypeORM links them for us.
  // (order) => order.user points to the matching property on the Order side.
  @OneToMany(() => Order, (order) => order.user)
  orders!: Order[];
}
