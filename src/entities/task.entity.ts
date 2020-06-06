import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TaskStatus } from '../tasks/models/tasks.model';
import { UserEntity } from './user.entity';

@Entity()
export class TaskEntity extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  title: string;
  @Column()
  description: string;
  @Column()
  status: TaskStatus;
  @Column()
  userId: number;

  @ManyToOne(type => UserEntity, user => user.tasks, { eager: false })
  user: UserEntity;
}