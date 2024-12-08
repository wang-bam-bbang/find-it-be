import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import {
  ApiInternalServerErrorResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { BuildingService } from './building.service';
import { CreateBuildingDto } from './dto/req/createBuilding.dto';
import { BuildingResponseDto } from './dto/res/buildingRes.dto';
import { UpdateBuildingDto } from './dto/req/updateBuilding.dto';

@ApiTags('Building')
@Controller('building')
export class BuildingController {
  constructor(private buildingService: BuildingService) {}

  @ApiOperation({
    summary: 'create building',
    description: 'register building information',
  })
  @ApiOkResponse({
    type: BuildingResponseDto,
    description: 'Return Created Building',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @Post()
  async createBuilding(
    @Body() createBuildingDto: CreateBuildingDto,
  ): Promise<BuildingResponseDto> {
    return this.buildingService.createBuilding(createBuildingDto);
  }

  @ApiOperation({
    summary: 'get all buildings',
    description: 'get all buildings information',
  })
  @ApiOkResponse({
    type: [BuildingResponseDto],
    description: 'Return All Buildings',
  })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @Get()
  async getAllBuildings(): Promise<BuildingResponseDto[]> {
    return this.buildingService.getAllBuildings();
  }

  @ApiOperation({
    summary: 'update building',
    description: 'update building',
  })
  @ApiOkResponse({
    type: BuildingResponseDto,
    description: 'Return updated building',
  })
  @Patch(':id')
  async updateBuilding(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateBuildingDto: UpdateBuildingDto,
  ): Promise<BuildingResponseDto> {
    return this.buildingService.updateBuilding(id, updateBuildingDto);
  }

  @ApiOperation({
    summary: 'delete building',
    description: 'delete building',
  })
  @ApiNoContentResponse({ description: 'No content returned' })
  @ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
  })
  @Delete(':id')
  async deletePost(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.buildingService.deleteBuilding(id);
  }
}
