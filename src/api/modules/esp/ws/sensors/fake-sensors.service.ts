import { EspSensorsData, EspSensor } from './sensors.types';
import { faker } from '@faker-js/faker';
import { Observable, interval, map } from 'rxjs';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { ESP_SENSORS_EVENT } from '../../constants';

@Injectable()
export class EspFakeSensorsWsService {
  constructor(private readonly eventEmitter: EventEmitter2) {
    this.broadcastSensors();
  }

  broadcastSensors(): void {
    this.getSensorsData().subscribe((data: EspSensorsData) => {
      this.eventEmitter.emit(ESP_SENSORS_EVENT, data, JSON.stringify(data));
    });
  }

  getSensorsData(): Observable<EspSensorsData> {
    return interval(1000).pipe(map(() => this.randomSensor()));
  }

  private randomSensor(): EspSensorsData {
    const sensors: EspSensor[] = [];

    sensors.push(this.randomAcSensor('acInput', 1));
    sensors.push(this.randomAcSensor('acOutput', 0.5));
    sensors.push(this.randomDcSensor('dcBattery'));

    return {
      createdAt: new Date().toJSON(),
      power: true,
      sensors,
      pTriggered: false,
    };
  }

  private randomAcSensor(name: string, prob = 1): EspSensor {
    return {
      name,
      voltage: faker.helpers.maybe(
        () => faker.number.float({ min: 170, max: 260 }),
        { probability: prob },
      ),
      current: faker.number.float({ min: 0, max: 5 }),
      power: faker.number.float({
        min: 0,
        max: 10,
        fractionDigits: faker.number.int({ min: 2, max: 4 }),
      }),
      energy: faker.number.float({
        min: 0,
        max: 50,
        fractionDigits: faker.number.int({ min: 3, max: 5 }),
      }),
      frequency: faker.number.int({ min: 50, max: 60 }),
      powerFactor: faker.number.float({ min: 0, max: 1 }),
      t1Energy: faker.number.float({
        min: 0,
        max: 50,
        fractionDigits: faker.number.int({ min: 0, max: 3 }),
      }),
      t2Energy: faker.number.float({
        min: 0,
        max: 50,
        fractionDigits: faker.number.int({ min: 0, max: 3 }),
      }),
      protection: {
        acOutputAvgFrequency: faker.datatype.boolean(),
        acOutputVoltage: faker.datatype.boolean(),
      },
    };
  }

  private randomDcSensor(name: string): EspSensor {
    return {
      name,
      voltage: faker.number.float({ min: 10, max: 70, fractionDigits: 3 }),
      protection: {
        dcBatteryVoltage: faker.datatype.boolean(),
      },
    };
  }
}
