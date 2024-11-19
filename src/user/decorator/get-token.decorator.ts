import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const GetAccessToken = createParamDecorator(
  (_data, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest();

    return req.user?.accessToken;
  },
);
