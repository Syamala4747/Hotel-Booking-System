import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan } from 'typeorm';
import { Booking, BookingStatus } from '../entities/booking.entity';
import { RoomsService } from '../rooms/rooms.service';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private bookingsRepository: Repository<Booking>,
    private roomsService: RoomsService,
  ) {}

  async create(userId: number, createBookingDto: CreateBookingDto): Promise<Booking> {
    const room = await this.roomsService.findOne(createBookingDto.roomId);
    
    if (!room.is_active) {
      throw new BadRequestException('Room is not available');
    }

    const startTime = new Date(createBookingDto.startTime);
    const endTime = new Date(createBookingDto.endTime);
    const now = new Date();

    // Validate dates
    if (startTime < now) {
      throw new BadRequestException('Check-in date cannot be in the past');
    }

    if (endTime <= startTime) {
      throw new BadRequestException('Check-out date must be after check-in date');
    }

    // Check for booking conflicts
    const conflictingBookings = await this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.room_id = :roomId', { roomId: createBookingDto.roomId })
      .andWhere('booking.start_time < :endTime', { endTime })
      .andWhere('booking.end_time > :startTime', { startTime })
      .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED })
      .getMany();

    if (conflictingBookings.length > 0) {
      throw new BadRequestException('Room already booked in this time range');
    }

    // Calculate duration and total cost
    const diffTime = endTime.getTime() - startTime.getTime();
    const durationHours = Math.ceil(diffTime / (1000 * 60 * 60));
    
    // Treat room.cost as daily rate, calculate hourly rate
    const dailyRate = room.cost;
    const hourlyRate = dailyRate / 24;
    
    // Calculate cost based on duration
    let totalCost: number;
    if (durationHours <= 6) {
      // Minimum 6 hours
      totalCost = Math.ceil(6 * hourlyRate);
    } else if (durationHours <= 12) {
      // Hourly rate for 6-12 hours
      totalCost = Math.ceil(durationHours * hourlyRate);
    } else if (durationHours <= 24) {
      // Full day rate for 12-24 hours
      totalCost = dailyRate;
    } else {
      // Multiple days
      const days = Math.ceil(durationHours / 24);
      totalCost = days * dailyRate;
    }

    const booking = this.bookingsRepository.create({
      room: { id: createBookingDto.roomId },
      user: { id: userId },
      start_time: startTime,
      end_time: endTime,
      duration_hours: durationHours,
      total_cost: totalCost,
      payment_method: createBookingDto.paymentMethod || 'CASH',
    });

    return this.bookingsRepository.save(booking);
  }

  async findMyBookings(userId: number): Promise<Booking[]> {
    return this.bookingsRepository.find({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async findAll(): Promise<Booking[]> {
    return this.bookingsRepository.find({
      order: { created_at: 'DESC' },
    });
  }

  async findRoomBookings(roomId: number, date?: string): Promise<Booking[]> {
    const query = this.bookingsRepository
      .createQueryBuilder('booking')
      .where('booking.room_id = :roomId', { roomId })
      .andWhere('booking.status = :status', { status: BookingStatus.CONFIRMED });

    if (date) {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      query
        .andWhere('booking.start_time < :endOfDay', { endOfDay })
        .andWhere('booking.end_time > :startOfDay', { startOfDay });
    }

    return query.getMany();
  }

  async cancelBooking(bookingId: number, userId: number, userRole: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({
      where: { id: bookingId },
      relations: ['user'],
    });

    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Users can only cancel their own bookings, admins can cancel any
    if (userRole !== 'ADMIN' && booking.user.id !== userId) {
      throw new BadRequestException('You can only cancel your own bookings');
    }

    if (booking.status === BookingStatus.CANCELLED) {
      throw new BadRequestException('Booking is already cancelled');
    }

    booking.status = BookingStatus.CANCELLED;
    return this.bookingsRepository.save(booking);
  }

  async updateStatus(id: number, status: string): Promise<Booking> {
    const booking = await this.bookingsRepository.findOne({ where: { id } });
    
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }

    // Validate status
    const validStatuses = Object.values(BookingStatus);
    if (!validStatuses.includes(status as BookingStatus)) {
      throw new BadRequestException('Invalid booking status');
    }

    booking.status = status as BookingStatus;
    return this.bookingsRepository.save(booking);
  }
}
