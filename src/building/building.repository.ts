import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateBuildingDto } from './dto/req/createBuilding.dto';
import { UpdateBuildingDto } from './dto/req/updateBuilding.dto';
import { BuildingResponseDto } from './dto/res/buildingRes.dto';

@Injectable()
export class BuildingRepository {
  constructor(private prismaService: PrismaService) {}

  async createBuilding(
    createBuildingDto: CreateBuildingDto,
  ): Promise<BuildingResponseDto> {
    return this.prismaService.building.create({
      data: {
        ...createBuildingDto,
      },
    });
  }

  async getAllBuildings(): Promise<BuildingResponseDto[]> {
    return this.prismaService.building.findMany({
      where: {},
    });
  }

  async getBuildingByName(name: string): Promise<BuildingResponseDto> {
    return this.prismaService.building.findUnique({
      where: { name },
    });
  }

  async getBuildingById(id: number): Promise<BuildingResponseDto> {
    return this.prismaService.building.findUnique({
      where: { id },
    });
  }

  async updateBuilding(
    id: number,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<BuildingResponseDto> {
    const updatedBuilding = await this.prismaService.building.update({
      where: { id },
      data: updateBuildingDto,
    });

    return updatedBuilding;
  }

  async deleteBuilding(id: number): Promise<void> {
    await this.prismaService.building.delete({
      where: { id },
    });
  }
}
