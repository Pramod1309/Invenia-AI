import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Use Render's persistent data directory or fallback to local
const DB_PATH = process.env.RENDER_DATA_PATH 
  ? path.join(process.env.RENDER_DATA_PATH, 'database.sqlite')
  : path.join(__dirname, '..', 'database.sqlite');

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

      // Create applications table
      await this.run(`
        CREATE TABLE IF NOT EXISTS applications (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          jobId INTEGER NOT NULL,
          applicantName TEXT NOT NULL,
          applicantEmail TEXT NOT NULL,
          applicantPhone TEXT NOT NULL,
          experience TEXT,
          education TEXT,
          coverLetter TEXT,
          resumeUrl TEXT,
          resumeUploaded INTEGER DEFAULT 0,
          testCompleted INTEGER DEFAULT 0,
          interviewCompleted INTEGER DEFAULT 0,
          testData TEXT,
          interviewData TEXT,
          status TEXT DEFAULT 'pending_stages',
          overallScore INTEGER DEFAULT 0,
          aiEvaluation TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (jobId) REFERENCES jobs (id)
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

  // Application operations
  async createApplication(applicationData) {
    const sql = `
      INSERT INTO applications (
        jobId, applicantName, applicantEmail, applicantPhone, experience, 
        education, coverLetter, resumeUrl, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const params = [
      applicationData.jobId,
      applicationData.applicantInfo.name,
      applicationData.applicantInfo.email,
      applicationData.applicantInfo.phone,
      applicationData.applicantInfo.experience || null,
      applicationData.applicantInfo.education || null,
      applicationData.applicantInfo.coverLetter || null,
      applicationData.applicantInfo.resume || null,
      applicationData.status || 'pending_stages'
    ];

    try {
      await this.run(sql, params);
      const result = await this.get('SELECT last_insert_rowid() as id');
      
      // Update job application count
      await this.run('UPDATE jobs SET applications = applications + 1 WHERE id = ?', [applicationData.jobId]);
      
      return this.getApplicationById(result.id);
    } catch (error) {
      throw error;
    }
  }

  async getApplicationById(id) {
    const sql = 'SELECT * FROM applications WHERE id = ?';
    const application = await this.get(sql, [id]);
    
    if (application) {
      // Parse JSON fields
      application.testData = JSON.parse(application.testData || '{}');
      application.interviewData = JSON.parse(application.interviewData || '[]');
      application.aiEvaluation = JSON.parse(application.aiEvaluation || '{}');
      
      // Convert boolean fields
      application.resumeUploaded = Boolean(application.resumeUploaded);
      application.testCompleted = Boolean(application.testCompleted);
      application.interviewCompleted = Boolean(application.interviewCompleted);
    }
    
    return application;
  }

  async getApplicationsByJobId(jobId) {
    const sql = 'SELECT * FROM applications WHERE jobId = ? ORDER BY createdAt DESC';
    const applications = await this.all(sql, [jobId]);
    
    // Parse JSON fields for each application
    return applications.map(app => ({
      ...app,
      testData: JSON.parse(app.testData || '{}'),
      interviewData: JSON.parse(app.interviewData || '[]'),
      aiEvaluation: JSON.parse(app.aiEvaluation || '{}'),
      resumeUploaded: Boolean(app.resumeUploaded),
      testCompleted: Boolean(app.testCompleted),
      interviewCompleted: Boolean(app.interviewCompleted)
    }));
  }

  async updateApplicationStage(id, stage, data) {
    const fields = ['status = ?'];
    const params = [stage];

    if (stage === 'resume_uploaded' && data.resumeUrl) {
      fields.push('resumeUrl = ?, resumeUploaded = 1');
      params.push(data.resumeUrl);
    } else if (stage === 'test_completed' && data.testData) {
      fields.push('testData = ?, testCompleted = 1');
      params.push(JSON.stringify(data.testData));
    } else if (stage === 'interview_completed' && data.interviewData) {
      fields.push('interviewData = ?, interviewCompleted = 1');
      params.push(JSON.stringify(data.interviewData));
    }

    fields.push('updatedAt = CURRENT_TIMESTAMP');
    params.push(id);

    const sql = `UPDATE applications SET ${fields.join(', ')} WHERE id = ?`;
    
    try {
      await this.run(sql, params);
      return this.getApplicationById(id);
    } catch (error) {
      throw error;
    }
  }

  async submitTest(id, testData) {
    const sql = `
      UPDATE applications 
      SET testData = ?, testCompleted = 1, status = 'test_completed', updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    try {
      await this.run(sql, [JSON.stringify(testData.testData), id]);
      return this.getApplicationById(id);
    } catch (error) {
      throw error;
    }
  }

  async submitInterview(id, interviewData) {
    const sql = `
      UPDATE applications 
      SET interviewData = ?, interviewCompleted = 1, status = 'interview_completed', updatedAt = CURRENT_TIMESTAMP 
      WHERE id = ?
    `;
    
    try {
      await this.run(sql, [JSON.stringify(interviewData.interviewData), id]);
      return this.getApplicationById(id);
    } catch (error) {
      throw error;
    }
  }

  async getAllApplications(status = null, page = 1, limit = 10) {
    let sql = 'SELECT * FROM applications';
    let params = [];
    
    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }
    
    sql += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);
    
    const applications = await this.all(sql, params);
    
    // Parse JSON fields for each application
    const parsedApplications = applications.map(app => ({
      ...app,
      testData: JSON.parse(app.testData || '{}'),
      interviewData: JSON.parse(app.interviewData || '[]'),
      aiEvaluation: JSON.parse(app.aiEvaluation || '{}'),
      resumeUploaded: Boolean(app.resumeUploaded),
      testCompleted: Boolean(app.testCompleted),
      interviewCompleted: Boolean(app.interviewCompleted)
    }));

    // Get total count for pagination
    let countSql = 'SELECT COUNT(*) as total FROM applications';
    let countParams = [];
    if (status) {
      countSql += ' WHERE status = ?';
      countParams.push(status);
    }
    const totalResult = await this.get(countSql, countParams);
    
    return {
      applications: parsedApplications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalResult.total,
        pages: Math.ceil(totalResult.total / limit)
      }
    };
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
