import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Request, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RoomsService } from './rooms.service';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('rooms')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post()
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('images', 20))
  create(
    @Body() createRoomDto: CreateRoomDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.roomsService.create(createRoomDto, files);
  }

  @Get()
  @Roles('ADMIN', 'USER')
  findAll(@Query('showInactive') showInactive: string, @Request() req) {
    const isAdmin = req.user.role === 'ADMIN';
    const show = isAdmin && showInactive === 'true';
    return this.roomsService.findAll(show);
  }

  @Get(':id')
  @Roles('ADMIN', 'USER')
  findOne(@Param('id') id: string) {
    return this.roomsService.findOne(+id);
  }

  @Get(':id/feedback')
  @Roles('ADMIN', 'USER')
  getRoomFeedbacks(@Param('id') id: string) {
    return this.roomsService.getRoomFeedbacks(+id);
  }

  @Patch(':id')
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('images', 20))
  update(
    @Param('id') id: string,
    @Body() updateRoomDto: UpdateRoomDto,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.roomsService.update(+id, updateRoomDto, files);
  }

  @Delete(':id')
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.roomsService.remove(+id);
  }
}
