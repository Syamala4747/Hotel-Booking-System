import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { GroqService } from './groq.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from '../entities/feedback.entity';
import { Room } from '../entities/room.entity';

@Controller('ai')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AiController {
  constructor(
    private groqService: GroqService,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    @InjectRepository(Room)
    private roomRepository: Repository<Room>,
  ) {}

  @Get('analyze-room/:roomId')
  @Roles('ADMIN')
  async analyzeRoomFeedbacks(@Param('roomId') roomId: string) {
    const feedbacks = await this.feedbackRepository.find({
      where: { room: { id: +roomId } },
      relations: ['user'],
      order: { created_at: 'DESC' },
    });

    const analysis = await this.groqService.analyzeFeedbacks(feedbacks);

    return {
      roomId: +roomId,
      totalFeedbacks: feedbacks.length,
      analysis,
    };
  }

  @Get('health')
  async checkAiHealth() {
    try {
      // Test AI connection with a simple prompt
      const testResult = await this.groqService.testConnection();
      return {
        status: 'connected',
        message: '✅ Groq AI is connected and ready',
        model: 'llama-3.1-8b-instant',
        working: testResult,
      };
    } catch (error) {
      return {
        status: 'error',
        message: '❌ Groq AI connection failed',
        error: error.message,
      };
    }
  }

  @Get('analyze-all')
  @Roles('ADMIN')
  async analyzeAllFeedbacks() {
    const feedbacks = await this.feedbackRepository.find({
      relations: ['user', 'room'],
      order: { created_at: 'DESC' },
    });

    const analysis = await this.groqService.analyzeFeedbacks(feedbacks);

    return {
      totalFeedbacks: feedbacks.length,
      analysis,
    };
  }

  @Get('room-summary/:roomId')
  @Roles('ADMIN')
  async getRoomSummary(@Param('roomId') roomId: string) {
    const room = await this.roomRepository.findOne({
      where: { id: +roomId },
    });

    if (!room) {
      return { error: 'Room not found' };
    }

    const feedbacks = await this.feedbackRepository.find({
      where: { room: { id: +roomId } },
      relations: ['user'],
    });

    const summary = await this.groqService.generateRoomSummary(room, feedbacks);

    return {
      roomId: +roomId,
      summary,
    };
  }

  @Post('chat')
  async chatWithBot(@Body() body: { message: string }) {
    const rooms = await this.roomRepository.find({
      where: { is_active: true },
    });

    const response = await this.groqService.chatWithUser(body.message, rooms);

    return {
      message: body.message,
      response,
    };
  }
}
