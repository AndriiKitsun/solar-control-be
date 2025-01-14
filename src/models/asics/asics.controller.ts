import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
} from '@nestjs/common';
import { AsicsService } from './asics.service';
import { CreateAsicDto, UpdateAsicDto } from './dto';
import { Asic } from './entities';
import { AsicIdParams } from './params';
import { AuthToken } from '@common/decorators';

@Controller('asics')
export class AsicsController {
  constructor(private readonly asicsService: AsicsService) {}

  @Post()
  create(@Body() createAsicDto: CreateAsicDto): Promise<Asic> {
    return this.asicsService.create(createAsicDto);
  }

  @Get()
  findAll(): Promise<Asic[]> {
    return this.asicsService.findAll();
  }

  @Get(':id')
  findOne(@Param() params: AsicIdParams): Promise<Asic> {
    return this.asicsService.findOne(params.id);
  }

  @Patch(':id')
  update(
    @Param() params: AsicIdParams,
    @Body() updateAsicDto: UpdateAsicDto,
  ): Promise<Asic> {
    return this.asicsService.update(params.id, updateAsicDto);
  }

  @Delete(':id')
  remove(@Param() params: AsicIdParams): Promise<void> {
    return this.asicsService.remove(params.id);
  }

  @Post(':id/start')
  start(
    @Param() params: AsicIdParams,
    @AuthToken() token: string,
  ): Promise<void> {
    return this.asicsService.start(params.id, token);
  }

  @Post(':id/stop')
  stop(
    @Param() params: AsicIdParams,
    @AuthToken() token: string,
  ): Promise<void> {
    return this.asicsService.stop(params.id, token);
  }
}
