import { IsOptional, IsString, IsNumber, IsArray, IsBoolean } from 'class-validator';

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  room_number?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  room_type?: string[];

  @IsOptional()
  @IsNumber()
  cost?: number;

  @IsOptional()
  @IsNumber()
  capacity?: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;
}
