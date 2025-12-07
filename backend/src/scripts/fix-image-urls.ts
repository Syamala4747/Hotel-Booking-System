import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function fixImageUrls() {
  const dataSource = new DataSource({
    type: 'postgres',
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    entities: ['src/**/*.entity.ts'],
    synchronize: false,
  });

  try {
    await dataSource.initialize();
    console.log('✅ Connected to database');

    // Get all rooms
    const rooms = await dataSource.query('SELECT * FROM rooms');
    console.log(`📊 Found ${rooms.length} rooms`);

    let updatedCount = 0;

    for (const room of rooms) {
      if (room.images && Array.isArray(room.images)) {
        let needsUpdate = false;
        const updatedImages = room.images.map((img: string) => {
          // Check if it's a localhost URL
          if (img.includes('localhost:3000/uploads/')) {
            console.log(`⚠️  Room ${room.room_number} has local image: ${img}`);
            console.log(`   Please re-upload this image through admin panel`);
            return img;
          }
          
          // Check if it's a Cloudinary URL without transformations
          if (img.includes('res.cloudinary.com') && !img.includes('q_auto')) {
            needsUpdate = true;
            // Add transformations to existing Cloudinary URL
            const urlParts = img.split('/upload/');
            const optimizedUrl = `${urlParts[0]}/upload/q_auto:best,f_auto,w_2000,c_limit,dpr_auto/${urlParts[1]}`;
            console.log(`🔧 Updating Room ${room.room_number} image to HD`);
            console.log(`   From: ${img}`);
            console.log(`   To: ${optimizedUrl}`);
            return optimizedUrl;
          }
          
          return img;
        });

        if (needsUpdate) {
          await dataSource.query(
            'UPDATE rooms SET images = $1 WHERE id = $2',
            [updatedImages, room.id]
          );
          updatedCount++;
          console.log(`✅ Updated Room ${room.room_number}`);
        }
      }
    }

    console.log(`\n📊 Summary:`);
    console.log(`   Total rooms: ${rooms.length}`);
    console.log(`   Updated to HD: ${updatedCount}`);
    console.log(`\n💡 Note: Rooms with localhost URLs need to be re-uploaded through admin panel`);

    await dataSource.destroy();
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
}

fixImageUrls();
