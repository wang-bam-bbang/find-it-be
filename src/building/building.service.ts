import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateBuildingDto } from './dto/req/createBuilding.dto';
import { BuildingRepository } from './building.repository';
import { UpdateBuildingDto } from './dto/req/updateBuilding.dto';
import { BuildingResponseDto } from './dto/res/buildingRes.dto';

@Injectable()
export class BuildingService {
  constructor(private buildingRepository: BuildingRepository) {}

  async createBuilding(
    createBuildingDto: CreateBuildingDto,
  ): Promise<BuildingResponseDto> {
    const building = await this.buildingRepository.getBuildingByName(
      createBuildingDto.name,
    );

    if (building) {
      throw new ConflictException('Building name already exists.');
    }

    return this.buildingRepository.createBuilding(createBuildingDto);
  }

  async getAllBuildings(): Promise<BuildingResponseDto[]> {
    return this.buildingRepository.getAllBuildings();
  }

  async updateBuilding(
    id: number,
    updateBuildingDto: UpdateBuildingDto,
  ): Promise<BuildingResponseDto> {
    const building = await this.buildingRepository.getBuildingById(id);
    if (!building) {
      throw new NotFoundException('Building not found.');
    }

    return this.buildingRepository.updateBuilding(id, updateBuildingDto);
  }

  async deleteBuilding(id: number): Promise<void> {
    const building = await this.buildingRepository.getBuildingById(id);
    if (!building) {
      throw new NotFoundException('Building not found.');
    }

    return this.buildingRepository.deleteBuilding(id);
  }
}
