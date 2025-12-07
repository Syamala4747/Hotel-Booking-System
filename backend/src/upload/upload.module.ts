import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { extname } from 'path';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';

@Module({
  imports: [
    MulterModule.register({
      storage: memoryStorage(), // Use memory storage for Cloudinary
      fileFilter: (req, file, callback) => {
        console.log('🔍 Checking file:', file.originalname, 'Type:', file.mimetype);
        
        // Check file extension
        const ext = extname(file.originalname).toLowerCase();
        const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
        
        // Check mimetype (if available)
        const validMimetype = file.mimetype && file.mimetype.match(/^image\/(jpg|jpeg|png|gif|webp)$/);
        
        // Accept if either extension is valid OR mimetype is valid
        if (allowedExtensions.includes(ext) || validMimetype) {
          console.log('✅ File type valid (ext:', ext, ', mime:', file.mimetype, ')');
          callback(null, true);
        } else {
          console.log('❌ Invalid file - ext:', ext, ', mime:', file.mimetype);
          return callback(new Error(`Only image files are allowed! File: ${file.originalname}`), false);
        }
      },
      limits: {
        fileSize: 20 * 1024 * 1024, // 20MB for HD images
      },
    }),
  ],
  controllers: [UploadController],
  providers: [UploadService],
})
export class UploadModule {}
