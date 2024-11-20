import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * Parameter decorator that extracts the user information from the request context.
 * @throw UnauthorizedException if user is not found in request
 * @throw UnauthorizedException if idp user is not found
 * @return IdP User's information(uuid, name)
 */
export const GetIdpUser = createParamDecorator(
  (_data, ctx: ExecutionContext): string | undefined => {
    const req = ctx.switchToHttp().getRequest();
    if (!req.user) {
      throw new UnauthorizedException('User not found in request');
    }

    if (!req.user.idpUserInfo) {
      throw new UnauthorizedException('IdP user information not found');
    }

    return req.user?.idpUserInfo;
  },
);
