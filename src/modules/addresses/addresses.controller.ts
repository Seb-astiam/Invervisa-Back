import { 
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AddressesService } from './addresses.service';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';
import { AuthGuard } from '@nestjs/passport';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { AuthUser } from '../users/dto/create-user.dto';

@UseGuards(AuthGuard('jwt'))
@Controller('addresses')
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() createAddressDto: CreateAddressDto) {
    return this.addressesService.create(user.id, createAddressDto);
  }

  @Get()
  async findMine(@CurrentUser() user: AuthUser) {
    return await this.addressesService.findByUser(user.id);
  }


  @Patch(':id')
  update(@Param('id') id: string, @CurrentUser() user: AuthUser, @Body() updateAddressDto: UpdateAddressDto) {
    return this.addressesService.update(id, user.id, updateAddressDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string, @CurrentUser() user: AuthUser) {
    return this.addressesService.remove(id, user.id);
  }
}
