import { EspPhase1PzemDto } from './esp-phase-1-pzem.dto';

export class CreateEspPhase1PzemDto {
  creationDateGmt: string;
  inputAc: EspPhase1PzemDto;
  outputAc: EspPhase1PzemDto;
  batteryOutputDc: EspPhase1PzemDto;
  solarOutputDc: EspPhase1PzemDto;
}
