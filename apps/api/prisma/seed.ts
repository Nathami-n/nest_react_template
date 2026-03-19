import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
// @ts-ignore
import dotenv from 'dotenv';
dotenv.config();

import { PrismaPg } from '@prisma/adapter-pg';

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  }),
});

async function main() {
  console.log('Seeding database...');

  // Create platform admin user (internal)
  const platformAdminPassword = await bcrypt.hash('platformadmin123', 10);
  const platformAdmin = await prisma.user.upsert({
    where: { email: 'platform@admin.com' },
    update: {},
    create: {
      email: 'platform@admin.com',
      password: platformAdminPassword,
      name: 'Platform Administrator',
      role: UserRole.PLATFORM_ADMIN,
      emailVerified: true,
      provider: 'local',
    },
  });

  console.log('Platform admin created:', platformAdmin.email);

  // Create admin user (organization admin)
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      role: UserRole.ADMIN,
      emailVerified: true,
      provider: 'local',
    },
  });

  console.log('Admin user created:', admin.email);

  // Create regular test user
  const userPassword = await bcrypt.hash('user123', 10);
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Test User',
      role: UserRole.USER,
      emailVerified: true,
      provider: 'local',
    },
  });

  console.log('Test user created:', user.email);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
