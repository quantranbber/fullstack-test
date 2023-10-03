import { Expose } from 'class-transformer';

export class ProductResponse {
  @Expose()
  id: number;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  price: number;

  @Expose()
  category: string;
}
