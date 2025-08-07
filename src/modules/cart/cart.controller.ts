import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

@UseGuards(AuthGuard('jwt'))
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  findMyCart(@CurrentUser() user: any) {
    return this.cartService.findByUser(user.id);
  }

  @Post()
  add(@CurrentUser() user, @Body() dto: CreateCartDto) {
    return this.cartService.addToCart(user.id, dto);
  }

  @Patch(':id')
  updateQuantity(@Param('id') id: string, @CurrentUser() user, @Body() dto: UpdateCartDto) {
    return this.cartService.updateQuantity(id, user.id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user) {
    return this.cartService.removeItem(id, user.id);
  }

  @Delete()
  clear(@CurrentUser() user) {
    return this.cartService.clearCart(user.id);
  }
}