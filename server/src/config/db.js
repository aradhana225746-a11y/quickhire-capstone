const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  try {
    console.log('🔄 Connecting to MongoDB Atlas...');
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000,
      tlsAllowInvalidCertificates: true
    });
    console.log(`✅ MongoDB Atlas Connected: ${conn.connection.host} / ${conn.connection.name}`);
    return conn;
  } catch (atlasError) {
    console.warn(`⚠️ MongoDB Atlas connection notice: ${atlasError.message}`);
    console.warn(
      `💡 Note: If you see SSL alert 80, your IP is not whitelisted in MongoDB Atlas. (Add 0.0.0.0/0 in Atlas Network Access to allow all networks).`
    );

    // Fallback: Start embedded MongoMemoryServer for instant local development
    try {
      console.log('🚀 Starting local embedded MongoDB instance for seamless development...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongod = await MongoMemoryServer.create();
      const localUri = mongod.getUri();
      const localConn = await mongoose.connect(localUri);
      console.log(`✅ Local In-Memory MongoDB Connected at ${localUri}`);

      // Auto-seed initial data so the app has jobs and demo users immediately
      const User = require('../models/User');
      const userCount = await User.countDocuments();
      if (userCount === 0) {
        console.log('🌱 Populating initial demo data in local MongoDB...');
        const Job = require('../models/Job');
        const Application = require('../models/Application');

        const recruiter = await User.create({
          name: 'Sarah Mathew (HR Lead)',
          email: 'recruiter@quickhire.com',
          password: 'password123',
          role: 'recruiter',
          company: 'TechWave Solutions',
          headline: 'Senior Technical Talent Acquisition Specialist'
        });

        const candidate = await User.create({
          name: 'Aradhana Rose',
          email: 'candidate@quickhire.com',
          password: 'password123',
          role: 'user',
          headline: 'Full Stack MERN Developer | React Enthusiast',
          skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JavaScript']
        });

        const sampleJobs = [
          {
            title: 'Junior Full Stack Developer (MERN)',
            company: 'TechWave Solutions',
            location: 'Kochi, Kerala (Hybrid)',
            jobType: 'Full-time',
            category: 'Engineering',
            experience: 'Fresher / 0-1 year',
            salary: '₹4,50,000 - ₹6,00,000 / year',
            description:
              'We are looking for an enthusiastic Junior Full Stack Developer proficient in React.js, Node.js, Express, and MongoDB. You will assist in developing high-performance web applications and collaborating with the product team.',
            requirements: [
              'Strong grasp of JavaScript ES6+, HTML5, CSS3',
              'Hands-on experience with React.js (Hooks, State Management)',
              'Understanding of REST APIs using Express and Node.js',
              'Familiarity with MongoDB and Git version control'
            ],
            postedBy: recruiter._id
          },
          {
            title: 'Frontend React.js Engineer',
            company: 'InnovateX Labs',
            location: 'Trivandrum, Kerala (Remote)',
            jobType: 'Remote',
            category: 'Engineering',
            experience: '1-3 years',
            salary: '₹6,00,000 - ₹8,50,000 / year',
            description:
              'Join our fast-growing UI engineering squad. You will be responsible for creating pixel-perfect, accessible, and responsive client-side web interfaces.',
            requirements: [
              '2+ years of React.js and modern component architectures',
              'Experience with Tailwind CSS or modern CSS modules',
              'Knowledge of client-side performance optimization',
              'Ability to write clean, reusable, maintainable code'
            ],
            postedBy: recruiter._id
          },
          {
            title: 'UI/UX Product Designer',
            company: 'PixelCraft Digital',
            location: 'Bangalore / Remote',
            jobType: 'Full-time',
            category: 'Design',
            experience: '1-2 years',
            salary: '₹5,00,000 - ₹7,50,000 / year',
            description:
              'Design modern, delightful digital experiences for our B2B SaaS customers. You will conduct user research, create wireframes, interactive prototypes, and design systems.',
            requirements: [
              'Proficiency in Figma and component libraries',
              'Demonstrated portfolio showcasing end-to-end design thinking',
              'Understanding of usability principles and responsive design'
            ],
            postedBy: recruiter._id
          },
          {
            title: 'Data Analyst Intern',
            company: 'Analytica Insights',
            location: 'Remote',
            jobType: 'Internship',
            category: 'Data',
            experience: 'Fresher',
            salary: '₹20,000 / month stipend',
            description:
              'Great opportunity for recent graduates passionate about data analysis, dashboard creation, SQL queries, and translating numbers into business impact.',
            requirements: [
              'Strong analytical and statistical reasoning',
              'Proficiency in SQL and Excel / Google Sheets',
              'Basic knowledge of Python or BI visualization tools'
            ],
            postedBy: recruiter._id
          }
        ];

        const insertedJobs = await Job.insertMany(sampleJobs);

        await Application.create({
          job: insertedJobs[0]._id,
          applicant: candidate._id,
          applicantName: candidate.name,
          applicantEmail: candidate.email,
          applicantPhone: '+91 9876543210',
          resumeLink: 'https://github.com/aradhanarose/portfolio',
          coverLetter:
            'I am excited to apply for the Junior Full Stack Developer position. I have completed projects using MongoDB, Express, React, and Node.js.',
          status: 'Reviewing'
        });

        console.log('✅ Demo users, active jobs, and sample application ready!');
      }

      return localConn;
    } catch (localError) {
      console.error(`❌ Fatal: Could not connect to any MongoDB instance: ${localError.message}`);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
