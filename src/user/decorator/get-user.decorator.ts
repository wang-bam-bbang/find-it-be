import {
  BadRequestException,
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Parameter decorator that extracts the user information from the request context.
 * @throw UnauthorizedException if user is not found in request
 * @throw BadRequestException if user is not found
 * @return User's information(uuid, name)
 */
export const GetUser = createParamDecorator(
  (_data, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest();

    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }

    if (!req.user.findIt) {
      throw new BadRequestException('User information not found');
    }

    return req.user?.findIt;
  },
);
