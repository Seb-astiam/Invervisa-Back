import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderFromCartDto } from './dto/create-order.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RolesGuard } from 'src/common/guards/roles.guard';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post('from-cart')
  createFromCart(@CurrentUser() user: any, @Body() dto: CreateOrderFromCartDto) {
    return this.ordersService.createFromCart(user.i, dto.addressId);
  }


  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  getMyOrders(@CurrentUser() user: any) {
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

}
