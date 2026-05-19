import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CATEGORY_REPOSITORY } from '../ports/category.repository';
import type { CategoryRepository } from '../ports/category.repository';

@Injectable()
export class DeleteCategoryUseCase {
  constructor(@Inject(CATEGORY_REPOSITORY) private readonly repo: CategoryRepository) {}

  async execute(id: number): Promise<void> {
    const found = await this.repo.findById(id);
    if (!found) throw new NotFoundException('Category not found');
    return this.repo.delete(id);
  }
}
