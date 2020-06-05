import { EntityRepository, Repository } from 'typeorm';
import { TaskEntity } from '../../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../models/tasks.model';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity>{

  async getTasks(filterDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    if (filterDto) {
      const { search, status } = filterDto;
      const query = this.createQueryBuilder('task');
      if (search) {
        query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` })
      }
      if (status) {
        query.andWhere('task.status = :status', { status });
      }
      return await query.getMany();
    }
  }

  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    if (createTaskDto) {
      const task = new TaskEntity();
      const { title, description } = createTaskDto;
      task.title = title;
      task.description = description;
      task.status = TaskStatus.OPEN
      await task.save();
      return task;
    }
  }

}