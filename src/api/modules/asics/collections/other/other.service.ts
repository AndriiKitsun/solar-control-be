import { Injectable } from '@nestjs/common';
import {
  AsicStatus,
  AsicInfo,
  AsicSummaryStats,
  AsicPerfSummary,
} from './other.types';
import { AsicsHttpBaseApiService } from '../../services/http-base.service';

@Injectable()
export class AsicsOtherApiService extends AsicsHttpBaseApiService {
  getStatus(ip: string): Promise<AsicStatus> {
    const url = this.buildUrl(ip, 'status');

    return this.get(url);
  }

  getInfo(ip: string): Promise<AsicInfo> {
    const url = this.buildUrl(ip, 'info');

    return this.get(url);
  }

  getSummary(ip: string): Promise<AsicSummaryStats> {
    const url = this.buildUrl(ip, 'summary');

    return this.get(url);
  }

  getPerfSummary(ip: string): Promise<AsicPerfSummary> {
    const url = this.buildUrl(ip, 'perf-summary');

    return this.get(url);
  }
}
