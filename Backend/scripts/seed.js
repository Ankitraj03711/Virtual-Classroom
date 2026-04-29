#!/usr/bin/env node

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import models
const User = require('../models/userModel');
const Classroom = require('../models/classroomModel');

const COLORS = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  info: (msg) => console.log(`${COLORS.blue}ℹ${COLORS.reset} ${msg}`),
  success: (msg) => console.log(`${COLORS.green}✓${COLORS.reset} ${msg}`),
  error: (msg) => console.error(`${COLORS.red}✗${COLORS.reset} ${msg}`),
  warn: (msg) => console.warn(`${COLORS.yellow}⚠${COLORS.reset} ${msg}`),
  section: (msg) => console.log(`\n${COLORS.cyan}${msg}${COLORS.reset}`),
};

async function connectDB() {
  try {
    log.info('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    log.success('Connected to MongoDB');
  } catch (error) {
    log.error(`Failed to connect to MongoDB: ${error.message}`);
    process.exit(1);
  }
}

async function clearDatabase() {
  log.section('🗑️  CLEARING DATABASE');
  try {
    const collections = [
      { model: User, name: 'Users' },
      { model: Classroom, name: 'Classrooms' },
      { model: require('../models/assignmentModel'), name: 'Assignments' },
      { model: require('../models/submissionModel'), name: 'Submissions' },
    ];

    let totalDeleted = 0;
    for (const { model, name } of collections) {
      const result = await model.deleteMany({});
      totalDeleted += result.deletedCount;
      log.success(`Cleared ${name}: ${result.deletedCount} documents removed`);
    }
    log.success(`Total documents deleted: ${totalDeleted}`);
  } catch (error) {
    log.error(`Error clearing database: ${error.message}`);
    throw error;
  }
}

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

async function createStudents() {
  log.section('👥 CREATING STUDENTS');
  const students = [];
  const password = await hashPassword('123456');

  for (let i = 1; i <= 10; i++) {
    try {
      const student = await User.create({
        firstName: `Student`,
        lastName: `${i}`,
        email: `student${i}@student.com`,
        password,
        role: 'student',
      });
      students.push(student);
      log.success(`Created student${i}@student.com (ID: ${student._id})`);
    } catch (error) {
      log.error(`Failed to create student${i}: ${error.message}`);
    }
  }

  return students;
}

async function createTeachers() {
  log.section('👨‍🏫 CREATING TEACHERS');
  const teachers = [];
  const password = await hashPassword('123456');

  for (let i = 1; i <= 5; i++) {
    try {
      const teacher = await User.create({
        firstName: `Teacher`,
        lastName: `${i}`,
        email: `teacher${i}@teacher.com`,
        password,
        role: 'teacher',
      });
      teachers.push(teacher);
      log.success(`Created teacher${i}@teacher.com (ID: ${teacher._id})`);
    } catch (error) {
      log.error(`Failed to create teacher${i}: ${error.message}`);
    }
  }

  return teachers;
}

function generateClassroomCode() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function createClassrooms(teachers, students) {
  log.section('🏫 CREATING CLASSROOMS');
  const classrooms = [];

  for (let i = 0; i < teachers.length; i++) {
    const teacherIdx = i;
    const numClassrooms = Math.random() > 0.5 ? 2 : 1;

    for (let j = 1; j <= numClassrooms; j++) {
      try {
        const classroom = await Classroom.create({
          name: `${teachers[teacherIdx].lastName}'s Class ${j}`,
          description: `A class created by Teacher ${teachers[teacherIdx].lastName}`,
          teacher: teachers[teacherIdx]._id,
          code: generateClassroomCode(),
          students: [],
        });
        classrooms.push(classroom);
        log.success(
          `Created classroom "${classroom.name}" (Code: ${classroom.code}, Teacher: ${teachers[teacherIdx].email})`
        );
      } catch (error) {
        log.error(`Failed to create classroom: ${error.message}`);
      }
    }
  }

  return classrooms;
}

async function enrollStudentsInClassrooms(classrooms, students) {
  log.section('✅ ENROLLING STUDENTS IN CLASSROOMS');

  for (const classroom of classrooms) {
    try {
      const numStudents = Math.floor(Math.random() * 5) + 6;
      const shuffled = [...students].sort(() => Math.random() - 0.5);
      const selectedStudents = shuffled.slice(0, numStudents);

      classroom.students = selectedStudents.map((s) => s._id);
      await classroom.save();

      log.success(
        `Enrolled ${selectedStudents.length} students in "${classroom.name}"`
      );

      const enrolledEmails = selectedStudents.map((s) => s.email).join(', ');
      log.info(`  Students: ${enrolledEmails}`);
    } catch (error) {
      log.error(`Failed to enroll students in classroom: ${error.message}`);
    }
  }
}

async function printSummary(students, teachers, classrooms) {
  log.section('📊 SEED SUMMARY');

  console.log(`
${COLORS.cyan}Test Accounts Created:${COLORS.reset}

${COLORS.green}Students (10):${COLORS.reset}
${students.map((s) => `  - ${s.email} (Password: 123456)`).join('\n')}

${COLORS.green}Teachers (5):${COLORS.reset}
${teachers.map((t) => `  - ${t.email} (Password: 123456)`).join('\n')}

${COLORS.green}Classrooms (${classrooms.length}):${COLORS.reset}
${classrooms.map((c) => {
  const teacherEmail = teachers.find((t) => t._id.toString() === c.teacher.toString())?.email || 'Unknown';
  return `  - ${c.name} (Code: ${c.code}, Teacher: ${teacherEmail}, Students: ${c.students.length})`;
}).join('\n')}

${COLORS.yellow}⚠️  Keep these credentials safe!${COLORS.reset}
  `);
}

async function main() {
  try {
    log.section('🚀 VIRTUAL CLASSROOM DATABASE SEEDER');
    log.info(`Environment: ${process.env.NODE_ENV || 'development'}`);

    if (process.env.NODE_ENV === 'production') {
      log.error('ABORTED: This script cannot run in production!');
      process.exit(1);
    }

    await connectDB();
    await clearDatabase();

    const students = await createStudents();
    const teachers = await createTeachers();
    const classrooms = await createClassrooms(teachers, students);
    await enrollStudentsInClassrooms(classrooms, students);

    await printSummary(students, teachers, classrooms);

    log.success('✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    log.error(`Fatal error: ${error.message}`);
    console.error(error);
    process.exit(1);
  }
}

main();