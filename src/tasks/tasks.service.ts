import { Injectable, NotFoundException } from '@nestjs/common';
import { ITask, TaskStatus } from './tasks.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  tasks: ITask[] = [];

  getAllTasks(): ITask[] {
    return this.tasks;
  }

  getTasksByFilter(filterDto: GetTasksFilterDto): ITask[] {
    const { status, search } = filterDto;
    let tasks = this.getAllTasks();
    if (status) {
       tasks = this.getTasksByStatus(status);
    }
    if (search) {
      tasks = this.getTasksBySearch(search);
    }
    return tasks;
  }

  private getTasksByStatus(status: TaskStatus): ITask[] {
    if (status) {
      return this.tasks.filter((task) => task.status === status);
    }
  }

  private getTasksBySearch(search: string): ITask[] {
    if (search) {
      return this.tasks.filter((task) => task.title.includes(search) || task.description.includes(search))
    }
  }

  getTaskById(id: string): ITask {
    if (id) {
      const found = this.tasks.find((task) => task.id === id);
      if (!found) {
        throw new NotFoundException(`Task with ${id} not found!`);
      } return found;
    }
  }

  createTask(createTaskDto: CreateTaskDto): ITask {
    if (createTaskDto) {
      const { title, description } = createTaskDto;
      const task: ITask = {
        id: uuid(),
        title,
        description,
        status: TaskStatus.OPEN
      }
      this.tasks = [...this.tasks, task];
      return task;
    }
  }

  deleteTask(id: string): boolean {
    if (id) {
      const hasIdInArray: boolean = this.tasks.some((task) => task.id === id);
      if (hasIdInArray) {
        const tasks = this.tasks.filter((task) => task.id !== id);
        this.tasks = [...tasks];
      } return hasIdInArray;
    }
  }

  private findIndexTaskById(id: string): number {
    if (id) {
      const index = this.tasks.findIndex((task) => task.id === id);
      if (index === -1) {
        throw new NotFoundException(`Task with ${id} not found!`);
      } return index;
    }
  }

  updateTaskStatus(id: string, status: TaskStatus): ITask {
    if (id && status) {
      const task = this.getTaskById(id);
      const updatedTask: ITask = {
        ...task,
        status,
      }
      const taskIndex: number = this.findIndexTaskById(id);
      this.tasks[taskIndex] = updatedTask;
      return updatedTask;
    }
  }
}
