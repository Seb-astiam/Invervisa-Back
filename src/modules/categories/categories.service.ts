import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>
  ) { }

  async create(createCategoryDto: CreateCategoryDto) {
    const category = this.categoryRepository.create(createCategoryDto);
    return this.categoryRepository.save(category);
  }

  async findAll() {
    return await this.categoryRepository.find({ relations: ['products'] });
  }

  async findOne(id: string) {
    const category = await this.categoryRepository.findOne({ where: { id } });
    if (!category) throw new NotFoundException('Categoria no encontrada')
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    await this.categoryRepository.update(id, updateCategoryDto);
    return this.findOne(id);
  }

  async remove(id: string) {
    await this.categoryRepository.delete(id);
    return { message: 'Categoria eliminada' };
  }

  async bulkCreate(items: CreateCategoryDto[]) {
    if (!Array.isArray(items) || items.length === 0) return [];

    const rows = items.map((it) => {
      return this.categoryRepository.create({
        name: it.name,
        description: it.description,
      })
    }
    );

    const CHUNK = 200;
    const created: CreateCategoryDto[] = [];
    for (let i = 0; i < rows.length; i += CHUNK) {
      const slice = rows.slice(i, i + CHUNK);
      created.push(...await this.categoryRepository.save(slice));
    }
    return created;


  }
}
