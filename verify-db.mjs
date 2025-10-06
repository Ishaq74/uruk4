#!/usr/bin/env node

/**
 * Script to verify PostgreSQL database connection and setup
 */

import { db } from './db.js';
import * as dotenv from 'dotenv';

dotenv.config();

async function testConnection() {
  console.log('🔍 Testing database connection...\n');
  
  try {
    // Test basic connection
    console.log('📡 Connecting to database...');
    const result = await db.execute('SELECT NOW() as current_time');
    console.log('✅ Connection successful!');
    console.log(`📅 Database time: ${result.rows[0].current_time}\n`);

    // Check if tables exist
    console.log('📊 Checking tables...');
    const tables = await db.execute(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);
    
    if (tables.rows.length === 0) {
      console.log('⚠️  No tables found. Please run: npm run db:push');
    } else {
      console.log(`✅ Found ${tables.rows.length} tables:`);
      tables.rows.forEach((row: any, idx: number) => {
        console.log(`   ${idx + 1}. ${row.table_name}`);
      });
    }
    
    console.log('\n✅ Database verification complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('\n📝 Please check:');
    console.error('   1. PostgreSQL is running');
    console.error('   2. DATABASE_URL in .env is correct');
    console.error('   3. Database exists and is accessible\n');
    process.exit(1);
  }
}

testConnection();
