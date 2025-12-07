import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Booking } from '../entities/booking.entity';
import { Room } from '../entities/room.entity';
import { BookingsService } from './bookings.service';
import { BookingsController } from './bookings.controller';
import { RoomsModule } from '../rooms/rooms.module';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Room]), RoomsModule],
  providers: [BookingsService],
  controllers: [BookingsController],
})
export class BookingsModule {}
