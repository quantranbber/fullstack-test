import { Logger } from '@core/decorators/logger.decorator';
import { logger } from '@core/logs/logger';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ProductRepository } from '@repositories/product.repository';
import { plainToInstance } from 'class-transformer';
import { ProductQuery } from '@modules/product/models/product.query';
import { ProductResponse } from '@modules/product/models/product.response';

@Injectable()
export class ProductService {
  constructor(private productRepository: ProductRepository) {}

  @Logger()
  async seedData() {
    try {
      const categories = [
        'category-1',
        'category-2',
        'category-3',
        'category-4',
      ];
      const data = [];
      for (let index = 0; index < 150000; index++) {
        data.push(
          this.productRepository.create({
            name: `product-${index}`,
            description: `description product ${index}`,
            price: parseFloat((Math.random() * 10).toFixed(2)),
            category: categories[Math.floor(Math.random() * categories.length)],
          }),
        );
      }

      await this.productRepository.save(data, { chunk: 200 });
    } catch (error) {
      logger.error('ADDRESS SERVICE ERROR: ', error);
      if (error?.status) {
        throw error;
      }
      throw new HttpException(
        { errorCode: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Logger()
  async list(query: ProductQuery) {
    try {
      return this.productRepository.list(query);
    } catch (error) {
      logger.error('ADDRESS SERVICE ERROR: ', error);
      if (error?.status) {
        throw error;
      }
      throw new HttpException(
        { errorCode: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Logger()
  async getDetail(id: number) {
    try {
      const data = await this.productRepository.findById(id);
      return plainToInstance(ProductResponse, data, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      logger.error('ADDRESS SERVICE ERROR: ', error);
      if (error?.status) {
        throw error;
      }
      throw new HttpException(
        { errorCode: HttpStatus.INTERNAL_SERVER_ERROR },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
