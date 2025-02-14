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
import { CreateAsicDto, UpdateAsicDto, AsicSummaryResponseDto } from './dto';
import { Asic } from './entities';
import { IdParams } from '@common/params';

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

  @Patch(':id')
  update(
    @Param() params: IdParams,
    @Body() updateAsicDto: UpdateAsicDto,
  ): Promise<Asic> {
    return this.asicsService.update(params.id, updateAsicDto);
  }

  @Delete(':id')
  remove(@Param() params: IdParams): Promise<void> {
    return this.asicsService.remove(params.id);
  }

  @Post(':id/start')
  start(@Param() params: IdParams): Promise<void> {
    return this.asicsService.start(params.id);
  }

  @Post(':id/stop')
  stop(@Param() params: IdParams): Promise<void> {
    return this.asicsService.stop(params.id);
  }

  @Get(':id/summary')
  getSummary(@Param() params: IdParams): Promise<AsicSummaryResponseDto> {
    return this.asicsService.getSummary(params.id);
  }
}
