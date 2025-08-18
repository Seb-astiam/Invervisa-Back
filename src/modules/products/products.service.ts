import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {

  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>
  ) { }

  async bulkCreate(items: CreateProductDto[]) {
    if (!Array.isArray(items) || items.length === 0) return [];

    const rows = items.map((it) => {
      return this.productRepository.create({
        name: it.name,
        description: it.description,
        price: Number(it.price ?? 0),
        stock: Number(it.stock ?? 0),
        discount: Number(it.discount ?? 0),
        brand: it.brand ?? 'nn',
        imageUrl: it.imageUrl ?? null,
        category: { id: it.categoryId } as any
      })
    }
    );

    const CHUNK = 200;
    const created: CreateProductDto[] = [];
    for (let i = 0; i < rows.length; i += CHUNK) {
      const slice = rows.slice(i, i + CHUNK);
      created.push(...await this.productRepository.save(slice));
    }
    return created;
  }

  async create(createProductDto: CreateProductDto) {
    const product = this.productRepository.create(createProductDto);
    return this.productRepository.save(product);
  }

  async findAll() {
    return this.productRepository.find({ relations: ['category'] });
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!product) throw new NotFoundException('Producto no encontrado');
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    await this.productRepository.update(id, updateProductDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    await this.productRepository.delete(id);
    return { message: 'producto eliminado' };
  }
}
