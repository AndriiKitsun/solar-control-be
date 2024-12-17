import { EspWsServiceInterface, EspPzem, EspPzemData } from '../esp.types';
import { EventEmitter } from 'node:events';
import { faker } from '@faker-js/faker';
import { Observable, interval, map } from 'rxjs';

export class FakeEspWsService implements EspWsServiceInterface {
  events = new EventEmitter();

  constructor() {
    this.broadcastPzems();
  }

  broadcastPzems(): void {
    this.getSensorsData().subscribe((data: EspPzemData) => {
      this.events.emit('message', data, JSON.stringify(data));
    });
  }

  getSensorsData(): Observable<EspPzemData> {
    return interval(1000).pipe(map(() => this.randomSensor()));
  }

  private randomSensor(): EspPzemData {
    const pzems: EspPzem[] = [];

    pzems.push(this.randomPzem('acInput'));
    pzems.push(this.randomPzem('acOutput'));

    if (faker.helpers.maybe(() => true, { probability: 0.95 })) {
      pzems.push(this.randomPzem('dcBattery'));
    }

    return {
      createdAtGmt: new Date().toJSON(),
      pzems,
    };
  }

  private randomPzem(name: string): EspPzem {
    return {
      name,
      voltageV: faker.number.float({ min: 170, max: 260 }),
      currentA: faker.number.float({ min: 0, max: 5 }),
      powerKw: faker.number.float({ min: 0, max: 10 }),
      energyKwh: faker.number.float({ min: 0, max: 50 }),
      frequencyHz: faker.number.int({ min: 50, max: 60 }),
      powerFactor: faker.number.float({ min: 0, max: 1 }),
      t1EnergyKwh: faker.number.float({ min: 0, max: 50 }),
      t2EnergyKwh: faker.number.float({ min: 0, max: 50 }),
    };
  }
}
