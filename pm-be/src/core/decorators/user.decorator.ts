import { AccountLogin } from '@core/models/account-login';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): AccountLogin => {
    data;
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
