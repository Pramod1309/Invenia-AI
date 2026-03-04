import db from './src/database/database.js';
import bcrypt from 'bcryptjs';

async function seedDatabase() {
  try {
    console.log('🌱 Starting database seeding...');

    // Create a demo user
    const hashedPassword = await bcrypt.hash('password123', 10);
    
    const demoUser = await db.createUser({
      name: 'Demo User',
      email: 'demo@example.com',
      password: hashedPassword,
    });

    console.log('✅ Demo user created:', demoUser);

    // Create sample jobs
    const sampleJobs = [
      {
        title: 'Senior Frontend Developer',
        department: 'Engineering',
        location: 'San Francisco, CA',
        employmentType: 'Full-time',
        remote: 'Hybrid',
        salary: '$120k-$150k',
        description: 'We are looking for a senior frontend developer with extensive experience in React and modern JavaScript frameworks. You will be working on our flagship product and collaborating with a talented team of engineers.',
        requirements: ['5+ years experience', 'React expertise', 'Bachelor\'s degree in Computer Science'],
        skills: ['React', 'TypeScript', 'CSS', 'Node.js', 'GraphQL'],
        status: 'open',
        aiStatus: 'ready',
        resumeCount: 12,
        pendingActions: 3,
        biasRisk: 'low',
        confidence: 85,
        aiMatchScore: 85,
        diversityScore: 75,
        timeToFill: 15,
        views: 145,
        applications: 12,
        shortlisted: 5,
        interviewed: 2,
        aiInsights: {
          recommendedSkills: ['React', 'TypeScript', 'GraphQL'],
          marketDemand: 'High',
          salaryCompetitiveness: 'Competitive',
          diversityPotential: 'Medium',
        },
        createdBy: demoUser.id,
      },
      {
        title: 'Product Manager',
        department: 'Product',
        location: 'New York, NY',
        employmentType: 'Full-time',
        remote: 'Remote',
        salary: '$130k-$160k',
        description: 'Seeking an experienced product manager to lead our product strategy and development. You will work closely with engineering, design, and marketing teams to deliver exceptional user experiences.',
        requirements: ['3+ years PM experience', 'MBA preferred', 'Strong analytical skills'],
        skills: ['Product Strategy', 'Analytics', 'Communication', 'Leadership', 'Agile'],
        status: 'screening',
        aiStatus: 'processing',
        resumeCount: 8,
        pendingActions: 2,
        biasRisk: 'medium',
        confidence: 78,
        aiMatchScore: 78,
        diversityScore: 82,
        timeToFill: 20,
        views: 98,
        applications: 8,
        shortlisted: 3,
        interviewed: 1,
        aiInsights: {
          recommendedSkills: ['Product Strategy', 'Analytics'],
          marketDemand: 'Very High',
          salaryCompetitiveness: 'Above Average',
          diversityPotential: 'High',
        },
        createdBy: demoUser.id,
      },
      {
        title: 'UX Designer',
        department: 'Design',
        location: 'Austin, TX',
        employmentType: 'Full-time',
        remote: 'Hybrid',
        salary: '$90k-$110k',
        description: 'We are seeking a talented UX Designer to create beautiful and intuitive user interfaces. You will be responsible for the entire design process from research to final implementation.',
        requirements: ['3+ years UX design experience', 'Portfolio required', 'Proficiency in design tools'],
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'UI Design'],
        status: 'interview',
        aiStatus: 'needs_review',
        resumeCount: 15,
        pendingActions: 5,
        biasRisk: 'low',
        confidence: 92,
        aiMatchScore: 92,
        diversityScore: 88,
        timeToFill: 10,
        views: 234,
        applications: 15,
        shortlisted: 8,
        interviewed: 4,
        aiInsights: {
          recommendedSkills: ['Figma', 'User Research'],
          marketDemand: 'High',
          salaryCompetitiveness: 'Competitive',
          diversityPotential: 'High',
        },
        createdBy: demoUser.id,
      },
      {
        title: 'Backend Engineer',
        department: 'Engineering',
        location: 'Seattle, WA',
        employmentType: 'Full-time',
        remote: 'On-site',
        salary: '$110k-$140k',
        description: 'Looking for a skilled backend engineer to build and maintain our server infrastructure. Experience with cloud services and microservices architecture is essential.',
        requirements: ['4+ years backend experience', 'Cloud experience', 'Database knowledge'],
        skills: ['Node.js', 'Python', 'AWS', 'MongoDB', 'Docker'],
        status: 'open',
        aiStatus: 'ready',
        resumeCount: 6,
        pendingActions: 1,
        biasRisk: 'medium',
        confidence: 81,
        aiMatchScore: 81,
        diversityScore: 73,
        timeToFill: 25,
        views: 89,
        applications: 6,
        shortlisted: 2,
        interviewed: 0,
        aiInsights: {
          recommendedSkills: ['Node.js', 'AWS'],
          marketDemand: 'Very High',
          salaryCompetitiveness: 'Competitive',
          diversityPotential: 'Medium',
        },
        createdBy: demoUser.id,
      },
      {
        title: 'Data Scientist',
        department: 'Analytics',
        location: 'Boston, MA',
        employmentType: 'Full-time',
        remote: 'Remote',
        salary: '$125k-$155k',
        description: 'We need a data scientist to help us make sense of our data and build predictive models. You will work on machine learning projects and provide insights to drive business decisions.',
        requirements: ['MS/PhD in relevant field', 'Experience with ML frameworks', 'Strong programming skills'],
        skills: ['Python', 'Machine Learning', 'Statistics', 'TensorFlow', 'SQL'],
        status: 'open',
        aiStatus: 'ready',
        resumeCount: 9,
        pendingActions: 2,
        biasRisk: 'low',
        confidence: 88,
        aiMatchScore: 88,
        diversityScore: 79,
        timeToFill: 30,
        views: 167,
        applications: 9,
        shortlisted: 4,
        interviewed: 1,
        aiInsights: {
          recommendedSkills: ['Python', 'Machine Learning'],
          marketDemand: 'Very High',
          salaryCompetitiveness: 'Above Average',
          diversityPotential: 'Medium',
        },
        createdBy: demoUser.id,
      }
    ];

    for (const jobData of sampleJobs) {
      const job = await db.createJob(jobData);
      console.log('✅ Job created:', job.title);
    }

    console.log('🎉 Database seeding completed successfully!');
    console.log('📊 Demo user: demo@example.com / password123');
    console.log('💼 Created 5 sample jobs');
    
    // Close the database connection
    db.close();
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedDatabase();
