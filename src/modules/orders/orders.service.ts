import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from '../order-items/entities/order-item.entity';
import { UpdateOrderDto } from './dto/update-order.dto';
import { ProductsService } from '../products/products.service';
import { CartService } from '../cart/cart.service';
import { AddressesService } from '../addresses/addresses.service';

@Injectable()
export class OrdersService {

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(OrderItem)
    private itemRepository: Repository<OrderItem>,
    private productsService: ProductsService,
    private cartService: CartService,
    private readonly addressesService: AddressesService,
  ) { }
    

  applyDiscount(base: number, discount?: number) {
    const d = Number(discount ?? 0);
    const p = Number(base ?? 0);
    if (d <= 0) return Number(p.toFixed(2));
    const val = p * (1 - d / 100);
    return Number(val.toFixed(2));
  }

  async createFromCart(userId: string, addressId: string) {
    const address = await this.addressesService.findOne(addressId, userId);
    if (!address) {
      throw new BadRequestException('La dirección no existe o no pertenece al usuario');
    }
    const cartItems = await this.cartService.getCartItemsWithProducts(userId);

    if (!cartItems.length) {
      throw new BadRequestException('El carrito está vacío');
    }

    let total = 0;
    const items: OrderItem[] = [];

    for (const cartItem of cartItems) {
      const product = cartItem.product;

      if (cartItem.quantity > product.stock) {
        throw new BadRequestException(`Stock insuficiente para ${product.name}`);
      }

      const unitPrice = this.applyDiscount(product.price, product.discount ?? 0)
      console.log(unitPrice, 'ver')

      const orderItem = this.itemRepository.create({
        productId: product.id,
        quantity: cartItem.quantity,
        priceAtPurchase: unitPrice,
        basePrice: Number(product.price),
        discountApplied: Number(product.discount ?? 0),
      });

      items.push(orderItem);
      total += unitPrice * cartItem.quantity;

      product.stock -= cartItem.quantity;
      await this.productsService.update(product.id, product);
    }

    const order = this.orderRepository.create({
      userId,
      addressId,
      totalPrice: Number(total.toFixed(2)),
      items,
    });

    const savedOrder = await this.orderRepository.save(order);

    await this.cartService.clearCart(userId);
    return savedOrder;
  }


  async findUserOrders(userId: string) {
    return this.orderRepository.find({
      where: { userId },
      relations: ['items', 'items.product', 'address'],
      order: { createdAt: 'DESC' },
    });
  }

  async findAll() {
    return await this.orderRepository.find({
      relations: ['user', 'items', 'items.product', 'address'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateStatus(id: string, status: string) {
    const order = await this.orderRepository.findOne({ where: { id } });
    if (!order) throw new NotFoundException();
    order.status = status as any
    return this.orderRepository.save(order);
  }

  async findOneForUser(orderId: string, userId: string) {

    return this.orderRepository.findOne({
      where: { id: orderId, userId },
      relations: ['items', 'items.product', 'address'],
    });
  }

  async findOneAdmin(orderId: string) {

    return this.orderRepository.findOne({
      where: { id: orderId },
      relations: ['user', 'items', 'items.product', 'address'],
    });
  }

  

}
