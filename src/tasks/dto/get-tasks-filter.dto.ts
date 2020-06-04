import { TaskStatus } from '../tasks.model';
import { IsIn, IsNotEmpty, IsOptional } from 'class-validator';
import { AllowedStatuses } from '../consts/allowed-statuses.const';

export class GetTasksFilterDto {
  @IsOptional()
  @IsIn(AllowedStatuses())
  status: TaskStatus;

  @IsOptional()
  @IsNotEmpty()
  search: string;
}