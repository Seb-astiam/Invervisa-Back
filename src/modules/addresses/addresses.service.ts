import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { Address } from './entities/address.entity';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
  constructor (
    @InjectRepository(Address)
    private addressRepository: Repository<Address>
  ) {}

  async findOne(id: string, userId: string) {
    return this.addressRepository.findOne({ where: { id, userId } });
  }
  

  async findByUser ( userId: string) {
    return await this.addressRepository.find({ where: { userId }});
  }

  async create(userId: string, createAddressDto: CreateAddressDto) {
    if(createAddressDto.isDefault) {
      await this.addressRepository.update({ userId }, { isDefault: false});
    }
    const address = this.addressRepository.create({ ...createAddressDto, userId});
    return this.addressRepository.save(address);
  }

  async update(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
    const address = await this.addressRepository.findOne({ where: {id, userId } });
    if(!address) throw new NotFoundException();

    if(updateAddressDto.isDefault) {
      await this.addressRepository.update({ userId}, { isDefault: false });
    }

    await this.addressRepository.update(id, updateAddressDto);
    return this.addressRepository.findOne({ where: { id } });
  }

  async remove(id: string, userId: string) {
    const address = await this.addressRepository.findOne({ where: { id, userId } });
    if(!address) throw new NotFoundException();
    await this.addressRepository.delete(id);
    return { message: 'Dirección eliminada' };
  }
}
