import { Pzem } from './pzem.entity';

// DB PZEM record definition
// TBD: should we use DB relations to link Pzem and PzemRecord tables?
export class PzemRecord {
  input: Pzem;
  output: Pzem;
  accOutput: Pzem;
  solarOutput: Pzem;
  recordTimeGmt: string;
}
