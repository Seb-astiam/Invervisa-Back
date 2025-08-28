// src/modules/orders/entities/order-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from '../../orders/entities/order.entity';
import { Product } from 'src/modules/products/entities/product.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Order, order => order.items)
  order: Order;

  @Column()
  orderId: string;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  productId: string;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  basePrice?: number;          
  
  @Column({ type: 'int', nullable: true })
  discountApplied?: number;

  @Column()
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  priceAtPurchase: number;
}
