import { IsOptional, IsString } from 'class-validator';
import { BaseQuery } from '@core/models/base.query';

export class ProductQuery extends BaseQuery {
  @IsString()
  @IsOptional()
  name: string;

  @IsString()
  @IsOptional()
  category: string;
}
