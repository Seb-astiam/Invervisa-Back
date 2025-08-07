import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { ProductsModule } from '../products/products.module';
import { CartModule } from '../cart/cart.module';
import { AddressesModule } from '../addresses/addresses.module';

@Module({
  imports: [TypeOrmModule.forFeature([Order, OrderItem]), ProductsModule, CartModule, AddressesModule],
  controllers: [OrdersController],
  providers: [OrdersService],
})
export class OrdersModule {}
