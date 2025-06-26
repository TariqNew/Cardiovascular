const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const BACKUP_DIR = path.join(__dirname, '../backups');
const DB_URL = process.env.DATABASE_URL;

// Ensure backup directory exists
if (!fs.existsSync(BACKUP_DIR)) {
  fs.mkdirSync(BACKUP_DIR, { recursive: true });
}

// Create timestamp for backup file
const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
const backupFile = path.join(BACKUP_DIR, `backup-${timestamp}.sql`);

// Parse database URL
const dbUrl = new URL(DB_URL);
const dbName = dbUrl.pathname.slice(1);
const dbUser = dbUrl.username;
const dbPass = dbUrl.password;
const dbHost = dbUrl.hostname;
const dbPort = dbUrl.port;

// Create pg_dump command
const pgDumpCommand = `PGPASSWORD=${dbPass} pg_dump -h ${dbHost} -p ${dbPort} -U ${dbUser} -F c -b -v -f "${backupFile}" ${dbName}`;

console.log('📦 Starting database backup...');

// Execute backup
exec(pgDumpCommand, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Backup failed:', error);
    process.exit(1);
  }

  console.log('✅ Backup completed successfully!');
  console.log(`📁 Backup file: ${backupFile}`);

  // Clean up old backups (keep last 5)
  const files = fs.readdirSync(BACKUP_DIR)
    .filter(file => file.startsWith('backup-'))
    .sort()
    .reverse();

  if (files.length > 5) {
    files.slice(5).forEach(file => {
      fs.unlinkSync(path.join(BACKUP_DIR, file));
      console.log(`🗑️  Removed old backup: ${file}`);
    });
  }
});

// Add restore function
function restoreDatabase(backupFile) {
  if (!fs.existsSync(backupFile)) {
    console.error(`❌ Backup file not found: ${backupFile}`);
    process.exit(1);
  }

  const restoreCommand = `PGPASSWORD=${dbPass} pg_restore -h ${dbHost} -p ${dbPort} -U ${dbUser} -d ${dbName} -v "${backupFile}"`;

  console.log('🔄 Starting database restore...');

  exec(restoreCommand, (error, stdout, stderr) => {
    if (error) {
      console.error('❌ Restore failed:', error);
      process.exit(1);
    }

    console.log('✅ Database restored successfully!');
  });
}

// If restore argument is provided
if (process.argv[2] === '--restore' && process.argv[3]) {
  restoreDatabase(process.argv[3]);
} 