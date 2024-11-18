import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { IdpStrategy } from './guard/idp.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { IdpModule } from 'src/idp/idp.module';
import { UserRepository } from './user.repository';
import { IdPGuard } from './guard/idp.guard';

@Module({
  imports: [PassportModule, ConfigModule, IdpModule],
  providers: [
    UserService,
    UserRepository,
    IdPGuard,
    IdpStrategy,
    PrismaService,
  ],
  controllers: [UserController],
  exports: [UserService, IdPGuard],
})
export class UserModule {}
