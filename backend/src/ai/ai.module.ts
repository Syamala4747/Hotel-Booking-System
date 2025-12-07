import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroqService } from './groq.service';
import { AiController } from './ai.controller';
import { Feedback } from '../entities/feedback.entity';
import { Room } from '../entities/room.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Room])],
  providers: [GroqService],
  controllers: [AiController],
  exports: [GroqService],
})
export class AiModule {}
