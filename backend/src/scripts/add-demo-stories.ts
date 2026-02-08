import { dbHelper } from '../db';
import { randomUUID } from 'crypto';

// Add demo stories for an attractive home screen
async function addDemoStories() {
  const admin = dbHelper.getUserByEmail('admin@rct.tn');
  if (!admin) {
    console.error('Admin user not found');
    process.exit(1);
  }

  // Get a few other users for variety
  const users = dbHelper.getAllUsers().slice(0, 4);
  
  const stories = [
    {
      id: randomUUID(),
      user_id: admin.id,
      image: 'https://images.unsplash.com/photo-1476480862126-209bfaa8edc8?w=400&h=700&fit=crop',
      caption: '🏃‍♂️ Entraînement matinal au parc du Belvédère ! #RCT #CourseAPied',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      user_id: users[0]?.id || admin.id,
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=700&fit=crop',
      caption: '💪 10km de footing ce matin ! Nouveau record personnel 🎉',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      user_id: users[1]?.id || admin.id,
      image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=400&h=700&fit=crop',
      caption: '🌅 Lever de soleil sur la corniche de Tunis 🏃‍♀️✨',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      user_id: users[2]?.id || admin.id,
      image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=400&h=700&fit=crop',
      caption: '🔥 Session fractionné avec le groupe ! On donne tout 💯',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      user_id: admin.id,
      image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=400&h=700&fit=crop',
      caption: '📍 Préparation du marathon de Tunis 2026 🏅 #TeamRCT',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      user_id: users[3]?.id || admin.id,
      image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=400&h=700&fit=crop',
      caption: '🏃‍♂️ Trail à Ain Draham ce week-end ! Qui vient ? 🌲',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      user_id: users[0]?.id || admin.id,
      image: 'https://images.unsplash.com/photo-1486218119243-13883505764c?w=400&h=700&fit=crop',
      caption: '⚡ Récupération active après une belle sortie longue 🧘‍♀️',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 7 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      user_id: admin.id,
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&h=700&fit=crop',
      caption: '🥇 Félicitations à tous les participants du 5km RCT ! 👏',
      expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    },
  ];

  console.log('Adding demo stories...');
  
  for (const story of stories) {
    try {
      dbHelper.createStory(story);
      console.log(`✅ Added story by user ${story.user_id.substring(0, 8)}...`);
    } catch (error) {
      console.error(`❌ Failed to add story:`, error);
    }
  }

  console.log(`\n🎉 Successfully added ${stories.length} demo stories!`);
  console.log('Stories will expire in 24 hours from now.');
}

addDemoStories().catch(console.error);
