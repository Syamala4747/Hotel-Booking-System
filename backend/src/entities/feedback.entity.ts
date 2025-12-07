import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';

@Entity('feedbacks')
export class Feedback {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, room => room.feedbacks, { eager: true })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, user => user.feedbacks, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('int')
  rating: number;

  @Column('text')
  comment: string;

  @CreateDateColumn()
  created_at: Date;
}
