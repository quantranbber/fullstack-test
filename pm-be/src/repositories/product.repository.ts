import { CustomRepository } from '@core/decorators/repository-custom.decorator';
import { Repository } from 'typeorm';
import { ProductEntity } from '@entities/product.entity';
import { ProductQuery } from '@modules/product/models/product.query';
import { escapeWildcards } from '@core/services/common.service';
import { constants } from '@src/constants/constants';
import { plainToInstance } from 'class-transformer';
import { ProductResponse } from '@modules/product/models/product.response';

@CustomRepository(ProductEntity)
export class ProductRepository extends Repository<ProductEntity> {
  async list(query: ProductQuery): Promise<{
    data: ProductResponse[];
    total: number;
  }> {
    const queryBuilder = this.createQueryBuilder().select().where('1=1');
    if (query.name) {
      queryBuilder.andWhere(`name ILIKE :name`, {
        name: `%${escapeWildcards(query.name)}%`,
      });
    }

    if (query.category) {
      queryBuilder.andWhere(`category ILIKE :category`, {
        category: `%${escapeWildcards(query.category)}%`,
      });
    }
    const [data, total] = await Promise.all([
      queryBuilder
        .orderBy('id', 'DESC')
        .limit(query.pageSize || constants.MIN_PAGE_SIZE)
        .offset((query.page || 0) * (query.pageSize || constants.MIN_PAGE_SIZE))
        .getMany(),
      queryBuilder.getCount(),
    ]);

    return {
      data: plainToInstance(ProductResponse, data, {
        excludeExtraneousValues: true,
      }),
      total,
    };
  }

  async findById(id: number): Promise<ProductEntity> {
    return this.findOneBy({ id });
  }
}
