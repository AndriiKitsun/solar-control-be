import { IsNumber, IsNotEmpty, Min } from 'class-validator';

export class ControlRuleDto {
  @Min(180)
  @IsNumber()
  @IsNotEmpty()
  scaleUpCheckTime!: number;

  @IsNumber()
  @IsNotEmpty()
  scaleUpValue!: number;

  @Min(90)
  @IsNumber()
  @IsNotEmpty()
  scaleDownCheckTime!: number;

  @IsNumber()
  @IsNotEmpty()
  scaleDown!: number;
}
