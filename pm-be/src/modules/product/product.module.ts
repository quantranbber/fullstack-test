import { Module } from '@nestjs/common';
import { ProductController } from '@modules/product/controllers/product.controller';
import { ProductService } from '@modules/product/services/product.service';

@Module({
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
