import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskRepository } from './repositories/task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskEntity } from './entities/task.entity';
import { TaskStatus } from './models/tasks.model';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {

  constructor(@InjectRepository(TaskRepository)
              private taskRepository: TaskRepository) {
  }

  getAllTasks(createTaskDto: GetTasksFilterDto): Promise<TaskEntity[]> {
    if (createTaskDto) {
      return this.taskRepository.getTasks(createTaskDto);
    }
  }
  //
  // getTasksByFilter(filterDto: GetTasksFilterDto): ITask[] {
  //   const { status, search } = filterDto;
  //   let tasks = this.getAllTasks();
  //   if (status) {
  //      tasks = this.getTasksByStatus(status);
  //   }
  //   if (search) {
  //     tasks = this.getTasksBySearch(search);
  //   }
  //   return tasks;
  // }
  //
  // private getTasksByStatus(status: TaskStatus): ITask[] {
  //   if (status) {
  //     return this.tasks.filter((task) => task.status === status);
  //   }
  // }
  //
  // private getTasksBySearch(search: string): ITask[] {
  //   if (search) {
  //     return this.tasks.filter((task) => task.title.includes(search) || task.description.includes(search))
  //   }
  // }
  //

  async getTaskById(id: number): Promise<TaskEntity> {
    if (id) {
      const found = await this.taskRepository.findOne(id);
      if (!found) {
        throw new NotFoundException(`Task with ${id} not found!`);
      } return found;
    }
  }
  // getTaskById(id: string): ITask {
  //   if (id) {
  //     const found = this.tasks.find((task) => task.id === id);
  //     if (!found) {
  //       throw new NotFoundException(`Task with ${id} not found!`);
  //     } return found;
  //   }
  // }
  //
  async createTask(createTaskDto: CreateTaskDto): Promise<TaskEntity> {
    if (createTaskDto) {
      return this.taskRepository.createTask(createTaskDto);
    }
  }

  async deleteTask(id: number): Promise<void> {
    if (id) {
      const result = await this.taskRepository.delete(id);
      if (result.affected === 0) {
        throw new NotFoundException(`Task with id ${id} not found!`);
      }
    }
  }
  //
  // private findIndexTaskById(id: string): number {
  //   if (id) {
  //     const index = this.tasks.findIndex((task) => task.id === id);
  //     if (index === -1) {
  //       throw new NotFoundException(`Task with ${id} not found!`);
  //     } return index;
  //   }
  // }
  //
  async updateTaskStatus(id: number, status: TaskStatus): Promise<TaskEntity> {
    if (id && status) {
      const task = await this.getTaskById(id);
      task.status = status;
      await task.save();
      return task;
    }
  }
}
