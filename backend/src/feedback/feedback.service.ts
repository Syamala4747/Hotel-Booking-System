import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';
import { Booking } from '../entities/booking.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';

@Injectable()
export class FeedbackService {
  constructor(
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Booking)
    private bookingRepository: Repository<Booking>,
  ) {}

  async create(userId: number, roomId: number, createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    // Check if user has a booking for this room
    const userBooking = await this.bookingRepository.findOne({
      where: {
        user: { id: userId },
        room: { id: roomId },
      },
    });

    if (!userBooking) {
      throw new BadRequestException('You can only give feedback for rooms you have booked');
    }

    const feedback = this.feedbackRepository.create({
      user: { id: userId },
      room: { id: roomId },
      rating: createFeedbackDto.rating,
      comment: createFeedbackDto.comment,
    });

    return this.feedbackRepository.save(feedback);
  }

  async update(feedbackId: number, userId: number, updateFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id: feedbackId },
      relations: ['user'],
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    if (feedback.user.id !== userId) {
      throw new BadRequestException('You can only edit your own feedback');
    }

    feedback.rating = updateFeedbackDto.rating;
    feedback.comment = updateFeedbackDto.comment;

    return this.feedbackRepository.save(feedback);
  }

  async delete(feedbackId: number, userId: number): Promise<void> {
    const feedback = await this.feedbackRepository.findOne({
      where: { id: feedbackId },
      relations: ['user'],
    });

    if (!feedback) {
      throw new NotFoundException('Feedback not found');
    }

    if (feedback.user.id !== userId) {
      throw new BadRequestException('You can only delete your own feedback');
    }

    await this.feedbackRepository.remove(feedback);
  }
}
