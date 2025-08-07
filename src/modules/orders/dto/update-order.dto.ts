import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderFromCartDto } from './create-order.dto';

export class UpdateOrderDto extends PartialType(CreateOrderFromCartDto) {}
