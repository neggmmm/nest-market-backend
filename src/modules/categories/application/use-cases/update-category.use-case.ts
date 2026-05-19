import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../ports/category.repository';
import type { CategoryRepository } from '../ports/category.repository';
import { CategoryOrmEntity } from '../../infrastructure/persistence/typeorm/category.orm-entity';

@Injectable()
export class UpdateCategoryUseCase {
  constructor(@Inject(CATEGORY_REPOSITORY) private readonly repo: CategoryRepository) {}

  async execute(id: number, data: Partial<CategoryOrmEntity>): Promise<CategoryOrmEntity> {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundException('Category not found');
    return this.repo.update(id, data);
  }
}
