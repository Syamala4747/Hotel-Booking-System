import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Room } from '../entities/room.entity';
import { Feedback } from '../entities/feedback.entity';
import { CreateRoomDto } from './dto/create-room.dto';
import { UpdateRoomDto } from './dto/update-room.dto';
import { CloudinaryService } from '../cloudinary/cloudinary.service';

@Injectable()
export class RoomsService {
  constructor(
    @InjectRepository(Room)
    private roomsRepository: Repository<Room>,
    @InjectRepository(Feedback)
    private feedbackRepository: Repository<Feedback>,
    private cloudinaryService: CloudinaryService,
  ) {}

  async create(createRoomDto: CreateRoomDto, files?: Express.Multer.File[]): Promise<Room> {
    console.log('🏨 Creating room with data:', createRoomDto);
    
    let imageUrls: string[] = [];
    
    // Upload files to Cloudinary if provided
    if (files && files.length > 0) {
      console.log('📸 Uploading', files.length, 'images to Cloudinary...');
      const uploadPromises = files.map(file => this.cloudinaryService.uploadImage(file));
      imageUrls = await Promise.all(uploadPromises);
      console.log('✅ Uploaded images:', imageUrls);
    } else if (createRoomDto.images) {
      // Use provided URLs if no files uploaded
      imageUrls = Array.isArray(createRoomDto.images) 
        ? createRoomDto.images 
        : [createRoomDto.images];
    }
    
    const room = this.roomsRepository.create({
      ...createRoomDto,
      images: imageUrls,
    });
    
    const saved = await this.roomsRepository.save(room);
    console.log('💾 Saved room:', saved);
    return saved;
  }

  async findAll(showInactive = false): Promise<Room[]> {
    const rooms = showInactive 
      ? await this.roomsRepository.find()
      : await this.roomsRepository.find({ where: { is_active: true } });
    
    console.log('📋 Returning rooms:', rooms.length);
    rooms.forEach(room => {
      console.log(`Room ${room.room_number} images:`, room.images, 'Type:', typeof room.images);
    });
    return rooms;
  }

  async findOne(id: number): Promise<Room> {
    const room = await this.roomsRepository.findOne({ where: { id } });
    if (!room) {
      throw new NotFoundException('Room not found');
    }
    return room;
  }

  async update(id: number, updateRoomDto: UpdateRoomDto, files?: Express.Multer.File[]): Promise<Room> {
    console.log('🔄 Updating room', id, 'with data:', updateRoomDto);
    const room = await this.findOne(id);
    
    let imageUrls: string[] = room.images || [];
    
    // Upload new files to Cloudinary if provided
    if (files && files.length > 0) {
      console.log('📸 Uploading', files.length, 'new images to Cloudinary...');
      const uploadPromises = files.map(file => this.cloudinaryService.uploadImage(file));
      const newUrls = await Promise.all(uploadPromises);
      imageUrls = [...imageUrls, ...newUrls];
      console.log('✅ Updated images:', imageUrls);
    } else if (updateRoomDto.images) {
      // Use provided URLs if no files uploaded
      imageUrls = Array.isArray(updateRoomDto.images) 
        ? updateRoomDto.images 
        : [updateRoomDto.images];
    }
    
    Object.assign(room, {
      ...updateRoomDto,
      images: imageUrls,
    });
    
    const saved = await this.roomsRepository.save(room);
    console.log('💾 Updated room:', saved);
    return saved;
  }

  async remove(id: number): Promise<void> {
    const room = await this.findOne(id);
    room.is_active = false;
    await this.roomsRepository.save(room);
  }

  async getRoomFeedbacks(roomId: number): Promise<Feedback[]> {
    return this.feedbackRepository.find({
      where: { room: { id: roomId } },
      order: { created_at: 'DESC' },
      relations: ['user'],
    });
  }
}
