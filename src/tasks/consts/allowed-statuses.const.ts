import { TaskStatus } from '../models/tasks.model';

export function AllowedStatuses(): (TaskStatus)[] {
  return [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ]
}