import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './repositories/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from '../entities/task.entity';
import { TaskStatus } from './models/tasks.model';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class TasksService {

  constructor(@InjectRepository(TaskRepository)
              private taskRepository: TaskRepository) {
  }

  getAllTasks(createTaskDto: GetTasksFilterDto, user: UserEntity): Promise<TaskEntity[]> {
    if (createTaskDto) {
      return this.taskRepository.getTasks(createTaskDto, user);
    }
  }

  async getTaskById(id: number, user: UserEntity): Promise<TaskEntity> {
    if (id) {
      const found = await this.taskRepository.findOne({ where: {
        id, userId: user.id
        }});
      if (!found) {
        throw new NotFoundException(`Task with ${id} not found!`);
      } return found;
    }
  }

  async createTask(createTaskDto: CreateTaskDto, user: UserEntity): Promise<TaskEntity> {
    if (createTaskDto) {
      return this.taskRepository.createTask(createTaskDto, user);
    }
  }

  async deleteTask(id: number, user: UserEntity): Promise<void> {
    if (id) {
      const result = await this.taskRepository.delete({ id, userId: user.id});
      if (result.affected === 0) {
        throw new NotFoundException(`Task with id ${id} not found!`);
      }
    }
  }

  async updateTaskStatus(id: number, status: TaskStatus, user: UserEntity): Promise<TaskEntity> {
    if (id && status) {
      const task = await this.getTaskById(id, user);
      task.status = status;
      await task.save();
      return task;
    }
  }
}
