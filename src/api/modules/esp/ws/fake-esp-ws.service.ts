import { EspWsServiceInterface, EspSensor, EspSensorsData } from '../esp.types';
import { EventEmitter } from 'node:events';
import { faker } from '@faker-js/faker';
import { Observable, interval, map } from 'rxjs';

export class FakeEspWsService implements EspWsServiceInterface {
  events = new EventEmitter();

  constructor() {
    this.broadcastPzems();
  }

  broadcastPzems(): void {
    this.getSensorsData().subscribe((data: EspSensorsData) => {
      this.events.emit('message', data, JSON.stringify(data));
    });
  }

  getSensorsData(): Observable<EspSensorsData> {
    return interval(1000).pipe(map(() => this.randomSensor()));
  }

  private randomSensor(): EspSensorsData {
    const sensors: EspSensor[] = [];

    sensors.push(this.randomAcPzem('acInput', 1));
    sensors.push(this.randomAcPzem('acOutput', 0.5));

    if (faker.helpers.maybe(() => true, { probability: 0.7 })) {
      sensors.push(this.randomDcPzem('dcBattery'));
    }

    return {
      createdAtGmt: new Date().toJSON(),
      sensors,
    };
  }

  private randomAcPzem(name: string, prob = 1): EspSensor {
    return {
      name,
      voltageV: faker.helpers.maybe(
        () => faker.number.float({ min: 170, max: 260 }),
        { probability: prob },
      ),
      currentA: faker.number.float({ min: 0, max: 5 }),
      powerKw: faker.number.float({
        min: 0,
        max: 10,
        fractionDigits: faker.number.int({ min: 2, max: 4 }),
      }),
      energyKwh: faker.number.float({
        min: 0,
        max: 50,
        fractionDigits: faker.number.int({ min: 3, max: 5 }),
      }),
      frequencyHz: faker.number.int({ min: 50, max: 60 }),
      powerFactor: faker.number.float({ min: 0, max: 1 }),
      t1EnergyKwh: faker.number.float({
        min: 0,
        max: 50,
        fractionDigits: faker.number.int({ min: 0, max: 3 }),
      }),
      t2EnergyKwh: faker.number.float({
        min: 0,
        max: 50,
        fractionDigits: faker.number.int({ min: 0, max: 3 }),
      }),
    };
  }

  private randomDcPzem(name: string): EspSensor {
    return {
      name,
      voltageV: faker.number.float({ min: 10, max: 36, fractionDigits: 2 }),
      currentA: faker.number.float({ min: 0, max: 5, fractionDigits: 2 }),
      powerKw: faker.number.float({
        min: 0,
        max: 2,
        fractionDigits: faker.number.int({ min: 2, max: 4 }),
      }),
      energyKwh: faker.number.float({
        min: 0,
        max: 6,
        fractionDigits: faker.number.int({ min: 3, max: 5 }),
      }),
    };
  }
}
