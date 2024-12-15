import { EspWsServiceInterface, EspPzemData } from '../esp.types';
import { EventEmitter } from 'node:events';
import { interval, tap } from 'rxjs';

export class FakeEspWsService implements EspWsServiceInterface {
  events = new EventEmitter();

  constructor() {
    this.broadcastPzems();
  }

  broadcastPzems(): void {
    interval(1000)
      .pipe(
        tap(() => {
          const pzem = this.generatePzem();

          this.events.emit('message', pzem, JSON.stringify(pzem));
        }),
      )
      .subscribe();
  }

  private generatePzem(): EspPzemData {
    return {
      createdAtGmt: new Date().toJSON(),
      pzems: [
        {
          id: '',
        },
      ],
    };
  }
}
