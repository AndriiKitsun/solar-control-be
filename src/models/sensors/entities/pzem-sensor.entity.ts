import { Pzem } from './pzem.entity';

export class PzemSensor {
  inputAc: Pzem;
  outputAc: Pzem;
  batteryOutputDc: Pzem;
  solarOutputDc: Pzem;
  recordDateGmt: string;
}
