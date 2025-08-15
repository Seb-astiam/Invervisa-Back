import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private cartRepository: Repository<Cart>
  ) {}

  async findByUser(userId: string) {
    return this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    });
  } 

  async addToCart(userId: string, dto: CreateCartDto) {
    const existing = await this.cartRepository.findOne({
      where: { userId, productId: dto.productId },
    });

    if (existing) { 
      existing.quantity += dto.quantity;
      return this.cartRepository.save(existing);
    }

    const item = this.cartRepository.create({ ...dto, userId });
    return this.cartRepository.save(item);
  }

  async updateQuantity(id: string, userId: string, dto: UpdateCartDto) {
    const item = await this.cartRepository.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('Item no encontrado');

    item.quantity = dto.quantity;
    return this.cartRepository.save(item);
  }

  async removeItem(id: string, userId: string) {
    const item = await this.cartRepository.findOne({ where: { id, userId } });
    if (!item) throw new NotFoundException('Item no encontrado');

    await this.cartRepository.delete(id);
    return { message: 'Producto eliminado del carrito' };
  }

  async clearCart(userId: string) {
    await this.cartRepository.delete({ userId });
    return { message: 'Carrito vaciado' };
  }

  async getCartItemsWithProducts(userId: string) {
    return this.cartRepository.find({
      where: { userId },
      relations: ['product'],
    })
  }
}
