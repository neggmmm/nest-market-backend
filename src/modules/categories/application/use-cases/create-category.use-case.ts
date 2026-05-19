import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../ports/category.repository';
import type { CategoryRepository } from '../ports/category.repository';
import { CategoryOrmEntity } from '../../infrastructure/persistence/typeorm/category.orm-entity';

@Injectable()
export class CreateCategoryUseCase {
  constructor(@Inject(CATEGORY_REPOSITORY) private readonly repo: CategoryRepository) {}

  async execute(data: { name: string; description?: string }): Promise<CategoryOrmEntity> {
    return this.repo.create(data as Partial<CategoryOrmEntity>);
  }
}
