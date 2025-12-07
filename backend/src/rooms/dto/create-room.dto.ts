import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional } from 'class-validator';

export class CreateRoomDto {
  @IsNotEmpty()
  @IsString()
  room_number: string;

  @IsNotEmpty()
  @IsArray()
  @IsString({ each: true })
  room_type: string[];

  @IsNotEmpty()
  @IsNumber()
  cost: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];
}
