import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clean existing data
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  console.log('✅ Cleaned existing data');

  // Create projects
  const project1 = await prisma.project.create({
    data: {
      name: 'Website Redesign',
      description: 'Complete overhaul of company website with modern design and improved UX',
      color: '#3B82F6',
    },
  });

  const project2 = await prisma.project.create({
    data: {
      name: 'Mobile App Development',
      description: 'Native mobile application for iOS and Android platforms',
      color: '#10B981',
    },
  });

  const project3 = await prisma.project.create({
    data: {
      name: 'API Integration',
      description: 'Integration with third-party payment and notification services',
      color: '#F59E0B',
    },
  });

  const project4 = await prisma.project.create({
    data: {
      name: 'Database Migration',
      description: 'Migrate legacy database to new PostgreSQL infrastructure',
      color: '#EF4444',
    },
  });

  console.log('✅ Created 4 projects');

  // Create tasks for Website Redesign
  await prisma.task.createMany({
    data: [
      {
        projectId: project1.id,
        title: 'Design homepage mockup',
        description: 'Create high-fidelity mockups for the new homepage design',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date('2026-05-15'),
      },
      {
        projectId: project1.id,
        title: 'Implement responsive navigation',
        description: 'Build mobile-first responsive navigation component',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date('2026-05-20'),
      },
      {
        projectId: project1.id,
        title: 'Optimize images and assets',
        description: 'Compress and optimize all images for faster loading',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: new Date('2026-05-25'),
      },
      {
        projectId: project1.id,
        title: 'Setup SEO metadata',
        description: 'Configure meta tags, Open Graph, and structured data',
        status: 'TODO',
        priority: 'MEDIUM',
      },
    ],
  });

  // Create tasks for Mobile App Development
  await prisma.task.createMany({
    data: [
      {
        projectId: project2.id,
        title: 'Setup React Native environment',
        description: 'Configure development environment for iOS and Android',
        status: 'COMPLETED',
        priority: 'URGENT',
        dueDate: new Date('2026-05-10'),
      },
      {
        projectId: project2.id,
        title: 'Build authentication flow',
        description: 'Implement login, registration, and password recovery',
        status: 'IN_REVIEW',
        priority: 'URGENT',
        dueDate: new Date('2026-05-18'),
      },
      {
        projectId: project2.id,
        title: 'Implement push notifications',
        description: 'Setup Firebase Cloud Messaging for notifications',
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        dueDate: new Date('2026-05-22'),
      },
      {
        projectId: project2.id,
        title: 'Create user profile screen',
        description: 'Design and implement user profile management',
        status: 'TODO',
        priority: 'MEDIUM',
      },
    ],
  });

  // Create tasks for API Integration
  await prisma.task.createMany({
    data: [
      {
        projectId: project3.id,
        title: 'Research payment gateways',
        description: 'Compare Stripe, PayPal, and other payment providers',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date('2026-05-12'),
      },
      {
        projectId: project3.id,
        title: 'Integrate Stripe API',
        description: 'Implement Stripe payment processing endpoints',
        status: 'IN_PROGRESS',
        priority: 'URGENT',
        dueDate: new Date('2026-05-19'),
      },
      {
        projectId: project3.id,
        title: 'Setup webhook handlers',
        description: 'Create endpoints to handle payment webhooks',
        status: 'TODO',
        priority: 'HIGH',
        dueDate: new Date('2026-05-24'),
      },
    ],
  });

  // Create tasks for Database Migration
  await prisma.task.createMany({
    data: [
      {
        projectId: project4.id,
        title: 'Analyze current schema',
        description: 'Document existing database structure and relationships',
        status: 'COMPLETED',
        priority: 'HIGH',
        dueDate: new Date('2026-05-08'),
      },
      {
        projectId: project4.id,
        title: 'Design new PostgreSQL schema',
        description: 'Create optimized schema for PostgreSQL database',
        status: 'IN_REVIEW',
        priority: 'HIGH',
        dueDate: new Date('2026-05-16'),
      },
      {
        projectId: project4.id,
        title: 'Write migration scripts',
        description: 'Create scripts to migrate data from old to new database',
        status: 'TODO',
        priority: 'URGENT',
        dueDate: new Date('2026-05-28'),
      },
    ],
  });

  console.log('✅ Created 14 tasks across all projects');

  // Show summary
  const projectsCount = await prisma.project.count();
  const tasksCount = await prisma.task.count();
  
  console.log('\n📊 Seed Summary:');
  console.log(`   Projects: ${projectsCount}`);
  console.log(`   Tasks: ${tasksCount}`);
  console.log('\n✨ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
