import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AsicsService } from './asics.service';
import {
  CreateAsicDto,
  AsicResponseDto,
  UpdateAsicDto,
  LoginAsicDto,
} from './dto';
import { AuthToken } from '@common/decorators';
import { AsicLoginResponse } from '@api/modules';

@Controller('asics')
export class AsicsController {
  constructor(private readonly asicsService: AsicsService) {}

  @Post()
  create(@Body() createAsicDto: CreateAsicDto): Promise<AsicResponseDto> {
    return this.asicsService.create(createAsicDto);
  }

  @Get()
  findAll(): Promise<AsicResponseDto[]> {
    return this.asicsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<AsicResponseDto> {
    return this.asicsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAsicDto: UpdateAsicDto,
  ): Promise<AsicResponseDto> {
    return this.asicsService.update(id, updateAsicDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<void> {
    return this.asicsService.remove(id);
  }

  @Post(':id/login')
  login(
    @Param('id') id: string,
    @Body() loginAsicDto: LoginAsicDto,
  ): Promise<AsicLoginResponse> {
    return this.asicsService.login(id, loginAsicDto);
  }

  @Post(':id/start')
  start(@Param('id') id: string, @AuthToken() token: string): Promise<void> {
    return this.asicsService.start(id, token);
  }

  @Post(':id/stop')
  stop(@Param('id') id: string, @AuthToken() token: string): Promise<void> {
    return this.asicsService.stop(id, token);
  }
}
