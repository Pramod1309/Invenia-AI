import db from './src/database/database.js';

async function clearJobsData() {
  try {
    console.log('🗑️  Clearing existing job data...');
    
    // Delete all jobs from the database
    await db.run('DELETE FROM jobs');
    
    // Verify all jobs are deleted
    const remainingJobs = await db.all('SELECT COUNT(*) as count FROM jobs');
    console.log(`✅ Cleared all jobs. Remaining: ${remainingJobs[0].count}`);
    
    // Keep the demo user but clear jobs
    const users = await db.getAllUsers();
    console.log(`👤 Keeping ${users.length} user(s) in database`);
    
    console.log('🎉 Database cleared successfully! Ready for fresh job creation.');
    
    // Close the database connection
    db.close();
    
  } catch (error) {
    console.error('❌ Error clearing database:', error);
    process.exit(1);
  }
}

// Run the clear function
clearJobsData();
