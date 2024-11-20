import { Module } from '@nestjs/common';
import { IdpService } from './idp.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule],
  providers: [IdpService],
  exports: [IdpService],
})
export class IdpModule {}
