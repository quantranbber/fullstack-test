import { HttpResponse } from '@core/models/http.response';
import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '@core/strategy/jwt-auth.guard';
import { ProductService } from '@modules/product/services/product.service';
import { Search } from '@core/decorators/search.decorator';
import { ProductQuery } from '@modules/product/models/product.query';

@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  // this is only for seed data
  @Public()
  @Get('seed')
  async seed() {
    await this.productService.seedData();
    return new HttpResponse().build();
  }

  @Public()
  @Get('')
  async list(@Search(ProductQuery) query: ProductQuery) {
    const { data, total } = await this.productService.list(query);
    return new HttpResponse(data).withMeta({ total }).build();
  }

  @Public()
  @Get('/:id')
  async findDetail(@Param('id') id: number) {
    const data = await this.productService.getDetail(id);
    return new HttpResponse(data).build();
  }
}
