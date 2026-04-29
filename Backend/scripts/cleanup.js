
/**
 * Database Cleanup Script
 * Deletes ALL data except the super admin account.
 * 
 * Usage: node scripts/cleanup.js
 */

require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const UserModel = require('../models/userModel');
const { Classroom } = require('../models/classroomModel');
const Assignment = require('../models/assignmentModel');
const Submission = require('../models/submissionModel');
const fs = require('fs');
const path = require('path');

const SUPER_ADMIN_EMAIL = process.env.SUPER_ADMIN || 'superadmin@superadmin.com';

async function cleanup() {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.mongoURL || process.env.mongoUrl);
    console.log('✅ Connected\n');

    // 1. Count before
    const userCount = await UserModel.countDocuments();
    const classroomCount = await Classroom.countDocuments();
    const assignmentCount = await Assignment.countDocuments();
    const submissionCount = await Submission.countDocuments();

    console.log('📊 Current counts:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Classrooms: ${classroomCount}`);
    console.log(`   Assignments: ${assignmentCount}`);
    console.log(`   Submissions: ${submissionCount}`);
    console.log('');

    // 2. Delete all non-admin users
    const delUsers = await UserModel.deleteMany({ email: { $ne: SUPER_ADMIN_EMAIL.toLowerCase() } });
    console.log(`🗑️  Deleted ${delUsers.deletedCount} users (kept admin: ${SUPER_ADMIN_EMAIL})`);

    // 3. Delete all classrooms, assignments, submissions
    const delClassrooms = await Classroom.deleteMany({});
    console.log(`🗑️  Deleted ${delClassrooms.deletedCount} classrooms`);

    const delAssignments = await Assignment.deleteMany({});
    console.log(`🗑️  Deleted ${delAssignments.deletedCount} assignments`);

    const delSubmissions = await Submission.deleteMany({});
    console.log(`🗑️  Deleted ${delSubmissions.deletedCount} submissions`);

    // 4. Clean uploaded files
    const uploadsDir = path.join(__dirname, '../uploads');
    const subDirs = ['assignments', 'submissions'];
    for (const dir of subDirs) {
        const dirPath = path.join(uploadsDir, dir);
        if (fs.existsSync(dirPath)) {
            const files = fs.readdirSync(dirPath);
            for (const file of files) {
                fs.unlinkSync(path.join(dirPath, file));
            }
            console.log(`🗑️  Cleared ${files.length} files from uploads/${dir}`);
        }
    }

    // 5. Update admin user — clear classroom refs
    await UserModel.updateOne(
        { email: SUPER_ADMIN_EMAIL.toLowerCase() },
        { $set: { classroomsJoined: [], classroomsCreated: [] } }
    );

    console.log('\n✅ Database cleanup complete! Only admin account remains.');
    await mongoose.disconnect();
    process.exit(0);
}

cleanup().catch(err => {
    console.error('❌ Cleanup failed:', err);
    process.exit(1);
});
