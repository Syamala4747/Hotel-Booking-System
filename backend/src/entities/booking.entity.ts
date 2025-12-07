import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, JoinColumn } from 'typeorm';
import { User } from './user.entity';
import { Room } from './room.entity';

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  CHECKED_IN = 'CHECKED_IN',
  CHECKED_OUT = 'CHECKED_OUT',
  CANCELLED = 'CANCELLED',
}

@Entity('bookings')
export class Booking {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Room, room => room.bookings, { eager: true })
  @JoinColumn({ name: 'room_id' })
  room: Room;

  @ManyToOne(() => User, user => user.bookings, { eager: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column('timestamp')
  start_time: Date;

  @Column('timestamp')
  end_time: Date;

  @Column({ type: 'int', nullable: true })
  duration_hours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  total_cost: number;

  @Column({ type: 'varchar', length: 50, nullable: true })
  payment_method: string;

  @Column({
    type: 'enum',
    enum: BookingStatus,
    default: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  @CreateDateColumn()
  created_at: Date;
}
