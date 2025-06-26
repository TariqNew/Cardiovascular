const { execSync } = require('child_process');
const path = require('path');

function executeCommand(command) {
  try {
    execSync(command, { stdio: 'inherit' });
  } catch (error) {
    console.error(`Failed to execute command: ${command}`);
    console.error(error);
    process.exit(1);
  }
}

async function main() {
  console.log('🚀 Starting database setup...');

  // Step 1: Generate Prisma Client
  console.log('\n📦 Generating Prisma Client...');
  executeCommand('npx prisma generate');

  // Step 2: Create and apply migrations
  console.log('\n🔄 Creating and applying migrations...');
  executeCommand('npx prisma migrate dev --name init');

  // Step 3: Verify database connection
  console.log('\n✅ Verifying database connection...');
  const { PrismaClient } = require('@prisma/client');
  const prisma = new PrismaClient();

  try {
    await prisma.$connect();
    console.log('Database connection successful!');

    // Optional: Add seed data if needed
    // await prisma.$executeRaw`INSERT INTO ...`;

    await prisma.$disconnect();
  } catch (error) {
    console.error('Failed to connect to database:', error);
    process.exit(1);
  }

  console.log('\n✨ Database setup completed successfully!');
  console.log('\nNext steps:');
  console.log('1. Start the server: npm run dev');
  console.log('2. Create your first user');
  console.log('3. Set up the health profile');
}

main()
  .catch((error) => {
    console.error('Setup failed:', error);
    process.exit(1);
  }); 