require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

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
    ]
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
      'Experience with Tailwind CSS or Material UI',
      'Knowledge of client-side performance optimization',
      'Ability to write clean, reusable, maintainable code'
    ]
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
    ]
  },
  {
    title: 'Cloud & DevOps Associate',
    company: 'CloudSphere Technologies',
    location: 'Kochi, Kerala',
    jobType: 'Full-time',
    category: 'Engineering',
    experience: 'Fresher / 0-2 years',
    salary: '₹5,50,000 - ₹7,00,000 / year',
    description:
      'Help maintain CI/CD pipelines, containerize backend microservices with Docker, and configure cloud hosting on AWS / Render.',
    requirements: [
      'Familiarity with Linux command line and Git',
      'Basic knowledge of Docker, CI/CD, and Cloud hosting',
      'Problem-solving mindset and eagerness to learn infrastructure as code'
    ]
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
    ]
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      tlsAllowInvalidCertificates: true,
      serverSelectionTimeoutMS: 10000
    });
    console.log('Connected to MongoDB Atlas for seeding...');

    // Clear existing data in QuickHire
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    console.log('Cleared existing collections in QuickHireDB.');

    // 1. Create Recruiter / Admin account
    const recruiter = await User.create({
      name: 'Sarah Mathew (HR Lead)',
      email: 'recruiter@quickhire.com',
      password: 'password123',
      role: 'recruiter',
      company: 'TechWave Solutions',
      headline: 'Senior Technical Talent Acquisition Specialist'
    });

    // 2. Create Candidate account
    const candidate = await User.create({
      name: 'Aradhana Rose',
      email: 'candidate@quickhire.com',
      password: 'password123',
      role: 'user',
      headline: 'Full Stack MERN Developer | React Enthusiast',
      skills: ['React.js', 'Node.js', 'Express', 'MongoDB', 'JavaScript', 'HTML/CSS']
    });

    console.log('Created Seed Users:');
    console.log(' - Recruiter: recruiter@quickhire.com / password123');
    console.log(' - Candidate: candidate@quickhire.com / password123');

    // 3. Create Sample Jobs posted by recruiter
    const jobsWithPoster = sampleJobs.map((j) => ({
      ...j,
      postedBy: recruiter._id
    }));

    const insertedJobs = await Job.insertMany(jobsWithPoster);
    console.log(`Inserted ${insertedJobs.length} active job listings.`);

    // 4. Create one initial application from candidate to the first job
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
    console.log('Created sample candidate application.');

    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDB();
