import { Pzem } from './entities';
import { CreatePzemDto } from './dto';

export type PzemWithVoltage = Pick<Pzem, 'voltageV'>;
export type PzemDtoToSave = CreatePzemDto & Pick<Pzem, 'avgVoltageV'>;
