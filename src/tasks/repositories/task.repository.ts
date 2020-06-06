import { EntityRepository, Repository } from 'typeorm';
import { TaskEntity } from '../../entities/task.entity';
import { CreateTaskDto } from '../dto/create-task.dto';
import { TaskStatus } from '../models/tasks.model';
import { GetTasksFilterDto } from '../dto/get-tasks-filter.dto';
import { UserEntity } from '../../entities/user.entity';
import { InternalServerErrorException } from '@nestjs/common';

@EntityRepository(TaskEntity)
export class TaskRepository extends Repository<TaskEntity>{

  async getTasks(filterDto: GetTasksFilterDto, user: UserEntity): Promise<TaskEntity[]> {
    if (filterDto) {
      const { search, status } = filterDto;
      const query = this.createQueryBuilder('task');
      query.where('task.userId = :userId', { userId: user.id })
      if (search) {
        query.andWhere('(task.title LIKE :search OR task.description LIKE :search)', { search: `%${search}%` })
      }
      if (status) {
        query.andWhere('task.status = :status', { status });
      }
      try {
        return await query.getMany();
      } catch (e) {
        throw new InternalServerErrorException();
      }
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
    if (createTaskDto) {
      const task = new TaskEntity();
      const { title, description } = createTaskDto;
      task.title = title;
      task.description = description;
      task.status = TaskStatus.OPEN
      task.user = user;
      await task.save();
      delete task.user;
      return task;
    }
  }

}