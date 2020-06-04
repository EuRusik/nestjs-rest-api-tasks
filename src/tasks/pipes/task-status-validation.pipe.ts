import { BadRequestException, PipeTransform } from '@nestjs/common';
import { AllowedStatuses } from '../consts/allowed-statuses.const';

export class TaskStatusValidationPipe implements PipeTransform {

  private static isStatusValid(status: any): boolean {
    const index = AllowedStatuses().indexOf(status)
    return index !== -1;
  }

  transform(value: any): any {
    value = value.toUpperCase();
    if (!TaskStatusValidationPipe.isStatusValid(value)) {
      throw new BadRequestException(`"${value}" is an invalid status!`);
    }
    return value;
  }
}