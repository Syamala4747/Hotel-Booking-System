import { Controller, Post, Put, Delete, Body, Param, UseGuards, Request } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller()
@UseGuards(JwtAuthGuard, RolesGuard)
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Post('rooms/:roomId/feedback')
  @Roles('USER')
  create(
    @Request() req,
    @Param('roomId') roomId: string,
    @Body() createFeedbackDto: CreateFeedbackDto,
  ) {
    return this.feedbackService.create(req.user.userId, +roomId, createFeedbackDto);
  }

  @Put('feedback/:id')
  @Roles('USER')
  update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateFeedbackDto: CreateFeedbackDto,
  ) {
    return this.feedbackService.update(+id, req.user.userId, updateFeedbackDto);
  }

  @Delete('feedback/:id')
  @Roles('USER')
  delete(
    @Request() req,
    @Param('id') id: string,
  ) {
    return this.feedbackService.delete(+id, req.user.userId);
  }
}
