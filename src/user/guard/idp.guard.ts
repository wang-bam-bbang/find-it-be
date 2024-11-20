import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/**
 * Guard for GSA IDP Service OAuth2 authentication.
 * Requires the 'idp' passport strategy to be configured in the application.
 *
 * @example
 * ```typescript
 * @UseGuards(IdpGruard)
 * @Get('info')
 * getUserInfo(@Request() req) {
 *   return req.user;
 * }
 */
@Injectable()
export class IdPGuard extends AuthGuard('idp') {}
