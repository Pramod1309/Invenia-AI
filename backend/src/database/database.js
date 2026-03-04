import sqlite3 from 'sqlite3';

const DB_PATH = './database.sqlite';

class Database {
  constructor() {
    this.db = new sqlite3.Database(DB_PATH, (err) => {
      if (err) {
        console.error('Error opening database:', err.message);
      } else {
        console.log('Connected to SQLite database');
        this.initializeTables();
      }
    });
  }

  async initializeTables() {
    try {
      // Create users table
      await this.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL,
          email TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          googleId TEXT,
          avatar TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create jobs table
      await this.run(`
        CREATE TABLE IF NOT EXISTS jobs (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          title TEXT NOT NULL,
          department TEXT NOT NULL,
          location TEXT NOT NULL,
          employmentType TEXT DEFAULT 'Full-time',
          remote TEXT DEFAULT 'On-site',
          salary TEXT NOT NULL,
          description TEXT NOT NULL,
          requirements TEXT,
          skills TEXT,
          status TEXT DEFAULT 'open',
          aiStatus TEXT DEFAULT 'ready',
          postedDate DATETIME DEFAULT CURRENT_TIMESTAMP,
          resumeCount INTEGER DEFAULT 0,
          pendingActions INTEGER DEFAULT 0,
          biasRisk TEXT DEFAULT 'low',
          confidence INTEGER DEFAULT 0,
          aiMatchScore INTEGER DEFAULT 0,
          diversityScore INTEGER DEFAULT 0,
          timeToFill INTEGER DEFAULT 0,
          views INTEGER DEFAULT 0,
          applications INTEGER DEFAULT 0,
          shortlisted INTEGER DEFAULT 0,
          interviewed INTEGER DEFAULT 0,
          aiInsights TEXT,
          createdBy INTEGER NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (createdBy) REFERENCES users (id)
        )
      `);

      console.log('Database tables initialized successfully');
    } catch (error) {
      console.error('Error initializing tables:', error);
    }
  }

  // Helper method to run queries
  run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, function(err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Helper method to get a single row
  get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (err, row) => {
        if (err) {
          reject(err);
        } else {
          resolve(row);
        }
      });
    });
  }

  // Helper method to get multiple rows
  all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (err, rows) => {
        if (err) {
          reject(err);
        } else {
          resolve(rows);
        }
      });
    });
  }

  // User operations
  async createUser(userData) {
    const sql = `
      INSERT INTO users (name, email, password, googleId, avatar)
      VALUES (?, ?, ?, ?, ?)
    `;
    const params = [userData.name, userData.email, userData.password, userData.googleId || null, userData.avatar || null];
    
    try {
      await this.run(sql, params);
      const result = await this.get('SELECT last_insert_rowid() as id');
      return { ...userData, id: result.id };
    } catch (error) {
      throw error;
    }
  }

  async getUserByEmail(email) {
    const sql = 'SELECT * FROM users WHERE email = ?';
    return this.get(sql, [email]);
  }

  async getUserById(id) {
    const sql = 'SELECT * FROM users WHERE id = ?';
    return this.get(sql, [id]);
  }

  async getAllUsers() {
    const sql = 'SELECT id, name, email, avatar, createdAt, updatedAt FROM users';
    return this.all(sql);
  }

  // Job operations
  async createJob(jobData) {
    const sql = `
      INSERT INTO jobs (
        title, department, location, employmentType, remote, salary, description,
        requirements, skills, status, aiStatus, resumeCount, pendingActions, biasRisk,
        confidence, aiMatchScore, diversityScore, timeToFill, views, applications,
        shortlisted, interviewed, aiInsights, createdBy
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      jobData.title,
      jobData.department,
      jobData.location,
      jobData.employmentType || 'Full-time',
      jobData.remote || 'On-site',
      jobData.salary,
      jobData.description,
      JSON.stringify(jobData.requirements || []),
      JSON.stringify(jobData.skills || []),
      jobData.status || 'open',
      jobData.aiStatus || 'ready',
      jobData.resumeCount || 0,
      jobData.pendingActions || 0,
      jobData.biasRisk || 'low',
      jobData.confidence || 0,
      jobData.aiMatchScore || 0,
      jobData.diversityScore || 0,
      jobData.timeToFill || 0,
      jobData.views || 0,
      jobData.applications || 0,
      jobData.shortlisted || 0,
      jobData.interviewed || 0,
      JSON.stringify(jobData.aiInsights || {}),
      jobData.createdBy
    ];

    try {
      await this.run(sql, params);
      const result = await this.get('SELECT last_insert_rowid() as id');
      return this.getJobById(result.id);
    } catch (error) {
      throw error;
    }
  }

  async getJobById(id) {
    const sql = 'SELECT * FROM jobs WHERE id = ?';
    const job = await this.get(sql, [id]);
    
    if (job) {
      // Parse JSON fields
      job.requirements = JSON.parse(job.requirements || '[]');
      job.skills = JSON.parse(job.skills || '[]');
      job.aiInsights = JSON.parse(job.aiInsights || '{}');
    }
    
    return job;
  }

  async getAllJobs(userId) {
    let sql = 'SELECT * FROM jobs';
    let params = [];
    
    if (userId) {
      sql += ' WHERE createdBy = ?';
      params.push(userId);
    }
    
    sql += ' ORDER BY createdAt DESC';
    
    const jobs = await this.all(sql, params);
    
    // Parse JSON fields for each job
    return jobs.map(job => ({
      ...job,
      requirements: JSON.parse(job.requirements || '[]'),
      skills: JSON.parse(job.skills || '[]'),
      aiInsights: JSON.parse(job.aiInsights || '{}')
    }));
  }

  async updateJob(id, jobData) {
    const fields = [];
    const params = [];
    
    // Build dynamic update query
    Object.keys(jobData).forEach(key => {
      if (key !== 'id' && jobData[key] !== undefined) {
        fields.push(`${key} = ?`);
        if (key === 'requirements' || key === 'skills' || key === 'aiInsights') {
          params.push(JSON.stringify(jobData[key]));
        } else {
          params.push(jobData[key]);
        }
      }
    });
    
    fields.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);
    
    const sql = `UPDATE jobs SET ${fields.join(', ')} WHERE id = ?`;
    
    try {
      await this.run(sql, params);
      return this.getJobById(id);
    } catch (error) {
      throw error;
    }
  }

  async deleteJob(id) {
    const sql = 'DELETE FROM jobs WHERE id = ?';
    await this.run(sql, [id]);
    return { id, deleted: true };
  }

  async getJobsByStatus(status, userId) {
    let sql = 'SELECT * FROM jobs WHERE status = ?';
    let params = [status];
    
    if (userId) {
      sql += ' AND createdBy = ?';
      params.push(userId);
    }
    
    sql += ' ORDER BY createdAt DESC';
    
    const jobs = await this.all(sql, params);
    
    // Parse JSON fields for each job
    return jobs.map(job => ({
      ...job,
      requirements: JSON.parse(job.requirements || '[]'),
      skills: JSON.parse(job.skills || '[]'),
      aiInsights: JSON.parse(job.aiInsights || '{}')
    }));
  }

  async getJobStats(userId) {
    let sql = `
      SELECT 
        COUNT(*) as totalJobs,
        SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as openJobs,
        SUM(CASE WHEN status = 'closed' THEN 1 ELSE 0 END) as closedJobs,
        SUM(applications) as totalApplications,
        SUM(views) as totalViews,
        AVG(timeToFill) as avgTimeToFill
      FROM jobs
    `;
    let params = [];
    
    if (userId) {
      sql += ' WHERE createdBy = ?';
      params.push(userId);
    }
    
    return this.get(sql, params);
  }

  async incrementJobViews(id) {
    const sql = 'UPDATE jobs SET views = views + 1 WHERE id = ?';
    await this.run(sql, [id]);
  }

  // Close database connection
  close() {
    this.db.close((err) => {
      if (err) {
        console.error('Error closing database:', err.message);
      } else {
        console.log('Database connection closed');
      }
    });
  }
}

// Create and export database instance
const db = new Database();
export default db;
