import { Module } from '@nestjs/common';
import { BuildingController } from './building.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { BuildingService } from './building.service';
import { BuildingRepository } from './building.repository';

@Module({
  imports: [PrismaModule],
  providers: [BuildingService, BuildingRepository],
  controllers: [BuildingController],
})
export class BuildingModule {}
