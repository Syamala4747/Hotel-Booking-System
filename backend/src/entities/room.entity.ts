import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Booking } from './booking.entity';
import { Feedback } from './feedback.entity';

export enum RoomType {
  AC = 'AC',
  NON_AC = 'NON_AC',
  WITH_VENTILATION = 'WITH_VENTILATION',
  WITHOUT_VENTILATION = 'WITHOUT_VENTILATION',
  BHK_2 = '2BHK',
  BHK_3 = '3BHK',
}

@Entity('rooms')
export class Room {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  room_number: string;

  @Column('text', { array: true })
  room_type: string[];

  @Column('decimal', { precision: 10, scale: 2 })
  cost: number;

  @Column('int', { nullable: true, default: 2 })
  capacity: number;

  @Column('text')
  description: string;

  @Column({ default: true })
  is_active: boolean;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @OneToMany(() => Booking, booking => booking.room)
  bookings: Booking[];

  @OneToMany(() => Feedback, feedback => feedback.room)
  feedbacks: Feedback[];
}
