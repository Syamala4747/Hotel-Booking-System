import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
  constructor() {
    // Configure Cloudinary
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
  }

  async uploadToCloudinary(file: Express.Multer.File): Promise<string> {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'hotel-rooms',
          // Upload without transformation (raw upload)
          resource_type: 'image',
          // Enable responsive breakpoints for different screen sizes
          responsive_breakpoints: {
            create_derived: true,
            bytes_step: 20000,
            min_width: 400,
            max_width: 2000,
            max_images: 5,
          },
        },
        (error, result) => {
          if (error) {
            console.error('❌ Cloudinary upload error:', error);
            reject(error);
          } else {
            // Use the secure_url with transformation parameters in the URL
            const baseUrl = result.secure_url;
            
            // Insert transformation parameters into the URL for MAXIMUM quality
            // q_100 = Maximum quality (no compression)
            // f_auto = Auto format (WebP/AVIF)
            // No width limit = Preserve original resolution
            const urlParts = baseUrl.split('/upload/');
            const optimizedUrl = `${urlParts[0]}/upload/q_100,f_auto/${urlParts[1]}`;
            
            console.log('✅ Cloudinary upload success');
            console.log('📸 Original URL:', result.secure_url);
            console.log('🎨 MAXIMUM Quality URL:', optimizedUrl);
            console.log('💾 Transformations: q_100 (maximum quality), f_auto (WebP/AVIF)');
            console.log('📊 No compression - preserving original quality');
            
            resolve(optimizedUrl);
          }
        },
      );

      // Convert buffer to stream and pipe to Cloudinary
      const bufferStream = new Readable();
      bufferStream.push(file.buffer);
      bufferStream.push(null);
      bufferStream.pipe(uploadStream);
    });
  }

  isCloudinaryConfigured(): boolean {
    return !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    );
  }
}
