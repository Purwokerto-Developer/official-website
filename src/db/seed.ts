import { db } from './index';
import { user, event_categories, events, articles } from './schema';
import { v4 as uuidv4 } from 'uuid';

async function seed() {
  console.log('🌱 Starting seed...');

  // 1. Create a dummy author/collaborator
  console.log('👤 Creating sample user...');
  const userId = 'sample-user-123';
  await db
    .insert(user)
    .values({
      id: userId,
      name: 'John Doe',
      email: 'john@purwokerto.dev',
      emailVerified: true,
      image: 'https://i.pravatar.cc/150?u=john',
      role: 'admin',
    })
    .onConflictDoNothing();

  // 2. Create sample event categories
  console.log('🏷️ Creating event categories...');
  const catIds = {
    techTalk: uuidv4(),
    workshop: uuidv4(),
    meetup: uuidv4(),
  };

  await db
    .insert(event_categories)
    .values([
      {
        id: catIds.techTalk,
        name: 'Tech Talk',
        description: 'Pemaparan materi teknologi terkini oleh para ahli',
      },
      {
        id: catIds.workshop,
        name: 'Workshop',
        description: 'Sesi praktek langsung (hands-on) membangun project',
      },
      {
        id: catIds.meetup,
        name: 'Casual Meetup',
        description: 'Kumpul santai, networking, dan diskusi ringan',
      },
    ])
    .onConflictDoNothing();

  // 3. Create sample events
  console.log('📅 Creating events...');
  const today = new Date();
  
  const upcomingEventDate = new Date(today);
  upcomingEventDate.setDate(today.getDate() + 14); // 2 weeks from now
  
  const pastEventDate = new Date(today);
  pastEventDate.setDate(today.getDate() - 30); // 1 month ago

  await db
    .insert(events)
    .values([
      {
        title: 'PurwokertoDev Next.js & React Meetup',
        slug: 'nextjs-react-meetup-2026',
        description:
          'Mari berkumpul dan bahas tentang React 19, Next.js App Router, dan cara optimasi web modern. Jangan lupa bawa laptop untuk sesi hands-on!',
        location_name: 'Hetero Space Banyumas',
        location_url: 'https://maps.app.goo.gl/placeholder',
        start_time: upcomingEventDate,
        event_type: 'offline',
        is_attendance_open: true,
        category_id: catIds.meetup,
        collaborator_id: userId,
        // using abstract gradients from unplash for tech events
        image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=2670&auto=format&fit=crop',
      },
      {
        title: 'Pengenalan Cloud Computing dengan AWS',
        slug: 'aws-cloud-computing-intro',
        description:
          'Webinar kolaborasi membahas dasar-dasar AWS, EC2, S3, dan cara deploy aplikasi pertama kamu ke cloud.',
        location_name: 'Zoom / Google Meet',
        start_time: pastEventDate,
        event_type: 'online',
        is_attendance_open: false,
        category_id: catIds.techTalk,
        collaborator_id: userId,
        image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2672&auto=format&fit=crop',
      },
      {
        title: 'Workshop: Membangun API dengan Go & PostgreSQL',
        slug: 'workshop-golang-api',
        description:
          'Sesi ngoding bareng (workshop) dari nol sampai deploy API menggunakan Golang. Cocok buat yang mau switch as a backend developer.',
        location_name: 'Amikom Purwokerto',
        start_time: new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        event_type: 'offline',
        is_attendance_open: true,
        category_id: catIds.workshop,
        collaborator_id: userId,
        image: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=2670&auto=format&fit=crop',
      },
    ])
    .onConflictDoNothing();

  // 4. Create sample articles
  console.log('✍️ Creating articles...');
  await db
    .insert(articles)
    .values([
      {
        title: 'Mengenal Turbopack di Next.js: Lebih Cepat dari Vite?',
        content:
          'Pernah ngerasa build time Next.js kerasa lambat? Nah, Vercel bikin Turbopack pakai Rust. Berbeda dengan Webpack yang me-rebuild semua, Turbopack melakukan komputasi increamental. Ini bikin HMR (Hot Module Replacement) kerasa instan banget. Coba bayangkan ngoding dengan feedback loop sepersekian detik, produktivitas bakal jauh meningkat. Di artikel ini kita akan coba setup dan uji kecepatannya langsung di project PurwokertoDev!',
        status: 'approved',
        author_id: userId,
        created_at: new Date(today.getTime() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
      {
        title: 'Kenapa Kita Ganti Framer Motion dengan CSS Vanilla',
        content:
          'Kemarin kita noticed kalau bundle size di homepage kita bengkak gara-gara Framer Motion. Framer emang keren buat complex physics & gesture, tapi buat sekadar fade-in dan slide-up pas pertama load, itu overkill. Kita decide buat ngelepas Framer Motion buat elemen statis dan pakai tailwind animate-in plus vanilla CSS animations. Hasilnya? TTI (Time to Interactive) turun signifikan dan TBT (Total Blocking Time) di Lighthouse hampir nol.',
        status: 'approved',
        author_id: userId,
        created_at: new Date(today.getTime() - 10 * 24 * 60 * 60 * 1000), // 10 days ago
      },
      {
        title: 'Menghindari Race Condition di Drizzle ORM',
        content:
          'Waktu kita bangun sistem presensi event PurwokertoDev, ada bug di mana jumlah peserta yang terdaftar melebihi kuota. Penyebabnya? Race condition! Kalau ada puluhan user klik daftar di saat yang persis bersamaan, query count(*) tidak cukup akurat. Solusinya kita pakai SQL Transactions dan optimisitic concurrency di Drizzle. Baca selengkapnya soal best practices handle traffic tinggi di PostgreSQL.',
        status: 'approved',
        author_id: userId,
        created_at: new Date(), // Today
      },
    ])
    .onConflictDoNothing();

  console.log('✨ Seeding complete!');
  process.exit(0);
}

seed().catch((e) => {
  console.error('❌ Seeding failed:');
  console.error(e);
  process.exit(1);
});
