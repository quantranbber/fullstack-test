import { constants } from '@src/constants/constants';
import { Allow } from 'class-validator';

export class BaseQuery {
  @Allow()
  page?: number;

  @Allow()
  pageSize?: number;

  get take(): number {
    const pageSize = Number(this.pageSize) || constants.MIN_PAGE_SIZE;
    return pageSize > 0 && pageSize < constants.MAX_PAGE_SIZE
      ? pageSize
      : constants.MIN_PAGE_SIZE;
  }

  get skip(): number {
    const page = (Number(this.page) || 1) - 1;
    return (page < 0 ? 0 : page) * this.take;
  }
}
