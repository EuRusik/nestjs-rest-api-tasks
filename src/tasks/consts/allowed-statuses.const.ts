import { TaskStatus } from '../tasks.model';

export function AllowedStatuses(): (TaskStatus)[] {
  return [
    TaskStatus.OPEN,
    TaskStatus.IN_PROGRESS,
    TaskStatus.DONE
  ]
}