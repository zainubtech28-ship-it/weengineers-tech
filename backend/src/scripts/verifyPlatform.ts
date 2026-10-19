import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { TeamMember } from '../models/TeamMember.js';
import { signToken } from '../utils/jwt.js';

dotenv.config();

const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/weengineers';

async function verifyPlatform() {
  try {
    console.log('[Verify] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[Verify] Connected.');

    // 1. Verify Founder Credentials
    const founder = await User.findOne({ email: 'founder@weengineers.tech' }).select('+password');
    if (!founder) {
      throw new Error('Founder user not found in database!');
    }
    const founderPassMatch = await bcrypt.compare('Founder@WeEngineers2026!', founder.password || '');
    if (!founderPassMatch) {
      throw new Error('Founder password does not match!');
    }
    const founderToken = signToken({
      userId: String(founder._id),
      email: founder.email,
      role: founder.role,
    });
    console.log(`[Verify] Founder authentication verified: ${founder.email} (Role: ${founder.role}, Token generated: ${Boolean(founderToken)})`);

    // 2. Verify Admin Credentials
    const admin = await User.findOne({ email: 'admin@weengineers.tech' }).select('+password');
    if (!admin) {
      throw new Error('Admin user not found in database!');
    }
    const adminPassMatch = await bcrypt.compare('Admin@WeEngineers2026!', admin.password || '');
    if (!adminPassMatch) {
      throw new Error('Admin password does not match!');
    }
    const adminToken = signToken({
      userId: String(admin._id),
      email: admin.email,
      role: admin.role,
    });
    console.log(`[Verify] Admin authentication verified: ${admin.email} (Role: ${admin.role}, Token generated: ${Boolean(adminToken)})`);

    // 3. Verify Team Members
    const teamMembers = await TeamMember.find({ isVisible: true }).sort({ order: 1 });
    console.log(`[Verify] Total Team Members: ${teamMembers.length}`);

    const expectedNames = [
      'SURESH R',
      'MAHARAJA',
      'SARANYA',
      'DHANYA SHANKARI',
      'ZAINUDEEN',
      'BALANAVIN S',
      'MAHESH',
      'MATHIVANAN',
      'VINOTH',
      'ADSHAYAA',
      'DEEPIKAA',
      'DEVIKAA',
      'ISHWARYALAKSHMI',
    ];

    if (teamMembers.length !== 13) {
      throw new Error(`Expected exactly 13 members, found ${teamMembers.length}`);
    }

    teamMembers.forEach((member, i) => {
      const expectedName = expectedNames[i];
      if (member.name !== expectedName) {
        throw new Error(`Mismatch at index ${i + 1}: expected "${expectedName}", got "${member.name}"`);
      }
      if (member.designation !== 'B.Tech Information Technology — 3rd Year') {
        throw new Error(`Invalid degree for ${member.name}: ${member.designation}`);
      }
      console.log(`  ✓ ${i + 1}. ${member.name} | ${member.designation}`);
    });

    console.log('[Verify] All verification checks PASSED successfully!');
    await mongoose.disconnect();
  } catch (err: any) {
    console.error('[Verify] Verification failed:', err.message);
    process.exit(1);
  }
}

verifyPlatform();
