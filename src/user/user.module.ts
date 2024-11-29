import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IdpStrategy } from './guard/idp.strategy';
import { IdpModule } from 'src/idp/idp.module';
import { UserRepository } from './user.repository';
import { IdPGuard } from './guard/idp.guard';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [PassportModule, ConfigModule, IdpModule, PrismaModule],
  providers: [UserService, UserRepository, IdPGuard, IdpStrategy],
  controllers: [UserController],
  exports: [UserService, IdPGuard],
})
export class UserModule {}
