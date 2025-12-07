import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createAdminHash() {
  const name = process.env.ADMIN_NAME || 'Hotel Admin';
  const email = process.env.ADMIN_EMAIL || 'hotel@gmail.com';
  const password = process.env.ADMIN_PASSWORD || '1234567890';
  
  const hash = await bcrypt.hash(password, 10);
  
  console.log('='.repeat(60));
  console.log('🔐 ADMIN CREDENTIALS');
  console.log('='.repeat(60));
  console.log(`Name:     ${name}`);
  console.log(`Email:    ${email}`);
  console.log(`Password: ${password}`);
  console.log('='.repeat(60));
  console.log('\n📝 Admin Password Hash:');
  console.log(hash);
  console.log('\n💾 Use this SQL to create admin:');
  console.log(`INSERT INTO users (name, email, password, role, created_at) VALUES ('${name}', '${email}', '${hash}', 'ADMIN', NOW()) ON CONFLICT (email) DO NOTHING;`);
  console.log('\n✅ Copy the SQL above and run it in your database!');
  console.log('='.repeat(60));
}

createAdminHash();
