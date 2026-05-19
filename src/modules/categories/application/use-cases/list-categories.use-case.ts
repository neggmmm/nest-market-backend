import { Inject, Injectable } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../ports/category.repository';
import type { CategoryRepository, Paginated } from '../ports/category.repository';
import { CategoryOrmEntity } from '../../infrastructure/persistence/typeorm/category.orm-entity';

@Injectable()
export class ListCategoriesUseCase {
  constructor(@Inject(CATEGORY_REPOSITORY) private readonly repo: CategoryRepository) {}

  async execute(page = 1, limit = 10): Promise<Paginated<CategoryOrmEntity>> {
    return this.repo.findAllPaginated(page, limit);
  }
}
