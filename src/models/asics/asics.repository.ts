import { Injectable, NotFoundException } from '@nestjs/common';
import { Asic } from './entities';
import { CreateAsicDto, AsicResponseDto, UpdateAsicDto } from './dto';
import { randomUUID } from 'node:crypto';

@Injectable()
export class AsicsRepository {
  private asics: Asic[] = [];

  async create(createAsicDto: CreateAsicDto): Promise<AsicResponseDto> {
    const asic: Asic = {
      id: randomUUID(),
      name: createAsicDto.name,
      ip: createAsicDto.ip,
    };

    this.asics.push(asic);

    return asic;
  }

  async findAll(): Promise<AsicResponseDto[]> {
    return this.asics;
  }

  async findOne(id: string): Promise<AsicResponseDto> {
    const asic = this.asics.find((asic) => asic.id === id);

    if (!asic) {
      throw new NotFoundException(`Asic with '${id}' id does not exist`);
    }

    return asic;
  }

  async update(
    id: string,
    updateAsicDto: UpdateAsicDto,
  ): Promise<AsicResponseDto> {
    const asicIdx = this.asics.findIndex((asic) => asic.id === id);

    if (asicIdx === -1) {
      throw new NotFoundException(`Asic with '${id}' id does not exist`);
    }

    Object.assign(this.asics[asicIdx], updateAsicDto);

    return this.asics[asicIdx];
  }

  async remove(id: string): Promise<void> {
    const asicIdx = this.asics.findIndex((asic) => asic.id === id);

    if (asicIdx === -1) {
      throw new NotFoundException(`Asic with '${id}' id does not exist`);
    }

    this.asics.splice(asicIdx, 1);
  }
}
