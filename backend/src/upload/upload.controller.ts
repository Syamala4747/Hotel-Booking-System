import { Controller, Post, UseInterceptors, UploadedFiles, UseGuards, BadRequestException } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UploadService } from './upload.service';

@Controller('upload')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post('images')
  @Roles('ADMIN')
  @UseInterceptors(FilesInterceptor('images', 10))
  async uploadImages(@UploadedFiles() files: Express.Multer.File[]) {
    try {
      console.log('📸 Upload request received');
      console.log('📁 Files:', files?.length || 0);
      
      if (!files || files.length === 0) {
        console.log('❌ No files received');
        return { images: [] };
      }

      // Check if Cloudinary is configured
      const useCloudinary = this.uploadService.isCloudinaryConfigured();
      console.log(`☁️  Using ${useCloudinary ? 'Cloudinary (HD Cloud Optimization)' : 'Local Storage'}`);

      if (useCloudinary) {
        // Upload to Cloudinary with HD optimization
        const uploadPromises = files.map(file => 
          this.uploadService.uploadToCloudinary(file)
        );
        
        const imageUrls = await Promise.all(uploadPromises);
        
        console.log('✅ All images uploaded to Cloudinary with HD optimization');
        console.log('📤 Returning HD URLs:', imageUrls);
        
        return { 
          images: imageUrls,
          source: 'cloudinary',
          quality: 'HD optimized'
        };
      } else {
        // Fallback: Return error message to configure Cloudinary
        throw new BadRequestException(
          'Cloudinary not configured. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET to your .env file'
        );
      }
    } catch (error) {
      console.error('❌ Upload error:', error);
      throw error;
    }
  }
}
