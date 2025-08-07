// src/modules/orders/entities/order.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from 'src/modules/users/entities/user.entity';
import { OrderItem } from '../../order-items/entities/order-item.entity';
import { Address } from 'src/modules/addresses/entities/address.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  addressId: string;

  @ManyToOne(() => Address)
  address: Address;

  @ManyToOne(() => User, user => user.orders)
  user: User;

  @Column()
  userId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: number;

  @Column({ default: 'pending' })
  status: 'pending' | 'paid' | 'shipped' | 'delivered' | 'cancelled';

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => OrderItem, item => item.order, { cascade: true })
  items: OrderItem[];
}
