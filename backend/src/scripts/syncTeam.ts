import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { TeamMember } from '../models/TeamMember.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/weengineers';

const OFFICIAL_TEAM_MEMBERS = [
  // First row
  { name: 'SURESH R', designation: 'B.Tech Information Technology — 3rd Year', order: 1, isVisible: true, isFounder: false },
  { name: 'MAHARAJA', designation: 'B.Tech Information Technology — 3rd Year', order: 2, isVisible: true, isFounder: false },
  { name: 'SARANYA', designation: 'B.Tech Information Technology — 3rd Year', order: 3, isVisible: true, isFounder: false },
  { name: 'DHANYA SHANKARI', designation: 'B.Tech Information Technology — 3rd Year', order: 4, isVisible: true, isFounder: false },
  // Second row
  { name: 'ZAINUDEEN', designation: 'B.Tech Information Technology — 3rd Year', order: 5, isVisible: true, isFounder: false },
  { name: 'BALANAVIN S', designation: 'B.Tech Information Technology — 3rd Year', order: 6, isVisible: true, isFounder: false },
  { name: 'MAHESH', designation: 'B.Tech Information Technology — 3rd Year', order: 7, isVisible: true, isFounder: false },
  { name: 'MATHIVANAN', designation: 'B.Tech Information Technology — 3rd Year', order: 8, isVisible: true, isFounder: false },
  // Third row
  { name: 'VINOTH', designation: 'B.Tech Information Technology — 3rd Year', order: 9, isVisible: true, isFounder: false },
  { name: 'ADSHAYAA', designation: 'B.Tech Information Technology — 3rd Year', order: 10, isVisible: true, isFounder: false },
  { name: 'DEEPIKAA', designation: 'B.Tech Information Technology — 3rd Year', order: 11, isVisible: true, isFounder: false },
  { name: 'DEVIKAA', designation: 'B.Tech Information Technology — 3rd Year', order: 12, isVisible: true, isFounder: false },
  { name: 'ISHWARYALAKSHMI', designation: 'B.Tech Information Technology — 3rd Year', order: 13, isVisible: true, isFounder: false },
];

async function syncTeam() {
  try {
    console.log('[SyncTeam] Connecting to database...');
    await mongoose.connect(mongoUri);
    console.log('[SyncTeam] Connected to MongoDB.');

    // Remove only TeamMember collection records - do NOT touch any other collections!
    const deleteResult = await TeamMember.deleteMany({});
    console.log(`[SyncTeam] Removed ${deleteResult.deletedCount} old team records.`);

    // Insert the exact 13 official members
    const insertResult = await TeamMember.insertMany(OFFICIAL_TEAM_MEMBERS);
    console.log(`[SyncTeam] Successfully inserted ${insertResult.length} official team members:`);
    insertResult.forEach((m, idx) => {
      console.log(`  ${idx + 1}. ${m.name} — ${m.designation}`);
    });

    await mongoose.disconnect();
    console.log('[SyncTeam] Done.');
  } catch (err) {
    console.error('[SyncTeam] Error syncing team members:', err);
    process.exit(1);
  }
}

syncTeam();
