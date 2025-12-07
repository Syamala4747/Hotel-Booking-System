import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { RoomsModule } from './rooms/rooms.module';
import { BookingsModule } from './bookings/bookings.module';
import { FeedbackModule } from './feedback/feedback.module';
import { UploadModule } from './upload/upload.module';
import { AiModule } from './ai/ai.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const databaseUrl = configService.get('DATABASE_URL');
        
        // If DATABASE_URL is provided (Neon or other cloud), use it
        if (databaseUrl) {
          console.log('🔗 Using DATABASE_URL connection string');
          console.log('🌐 Provider:', databaseUrl.includes('neon.tech') ? 'Neon PostgreSQL' : 'PostgreSQL');
          
          return {
            type: 'postgres' as const,
            url: databaseUrl,
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: false,
            ssl: databaseUrl.includes('sslmode=require') ? {
              rejectUnauthorized: false
            } : false,
          };
        }
        
        // Fallback to individual DB config variables (local development)
        console.log('🔗 Using individual DB config variables');
        const config = {
          type: 'postgres' as const,
          host: configService.get('DB_HOST', 'localhost'),
          port: parseInt(configService.get('DB_PORT', '5432')),
          username: configService.get('DB_USER', 'postgres'),
          password: configService.get('DB_PASS', 'omen'),
          database: configService.get('DB_NAME', 'postgres'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
          logging: false,
        };
        console.log('Database Config:', {
          ...config,
          password: '***',
        });
        return config;
      },
      inject: [ConfigService],
    }),
    AuthModule,
    UsersModule,
    RoomsModule,
    BookingsModule,
    FeedbackModule,
    UploadModule,
    AiModule,
  ],
})
export class AppModule {}
