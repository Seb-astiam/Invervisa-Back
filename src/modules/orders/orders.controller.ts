import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  NotFoundException
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderFromCartDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthUser } from '../users/dto/create-user.dto';

@Controller('orders')
@UseGuards(AuthGuard('jwt'))
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('from-cart')
  createFromCart(@CurrentUser() user: AuthUser, @Body() dto: CreateOrderFromCartDto) {
    return this.ordersService.createFromCart(user.id, dto.addressId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  getMyOrders(@CurrentUser() user: AuthUser) {
    return this.ordersService.findUserOrders(user.id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Get()
  getAll() {
    return this.ordersService.findAll();
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.ordersService.updateStatus(id, status);
  }

  @Get(':id')
  async getById(@CurrentUser() user: AuthUser, @Param('id') orderId: string) {

    if (user?.role === 'admin') {
      const o = await this.ordersService.findOneAdmin(orderId);
      if (!o) throw new NotFoundException('Orden no encontrada');
      return o;
    }

    const o = await this.ordersService.findOneForUser(orderId, user.id);
    if (!o) throw new NotFoundException('Orden no encontrada');
    return o;
  }

}
