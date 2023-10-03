import { Expose } from 'class-transformer';

export class AccountLogin {
  @Expose()
  id: number;

  @Expose()
  phoneNumber: string;
}
