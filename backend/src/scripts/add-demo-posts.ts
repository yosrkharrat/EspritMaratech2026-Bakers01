import { dbHelper } from '../db';
import { randomUUID } from 'crypto';

// Add demo posts for an attractive home screen
async function addDemoPosts() {
  const admin = dbHelper.getUserByEmail('admin@rct.tn');
  if (!admin) {
    console.error('Admin user not found');
    process.exit(1);
  }

  // Get a few other users for variety
  const users = dbHelper.getAllUsers().slice(0, 4);
  
  const posts = [
    {
      id: randomUUID(),
      author_id: admin.id,
      content: '🏃‍♂️ Belle session d\'entraînement ce matin avec le groupe ! 10km au parc du Belvédère sous un soleil magnifique ☀️ Bravo à tous pour la motivation ! 💪 #RCT #RunningClubTunis #TeamSpirit',
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=800&h=600&fit=crop',
      created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      author_id: users[0]?.id || admin.id,
      content: '🌅 Rien de mieux qu\'un lever de soleil sur la corniche pour bien commencer la journée ! Course matinale de 8km avec une vue exceptionnelle sur la Méditerranée 🌊 #MorningRun #TunisBeauty',
      image: 'https://images.unsplash.com/photo-1483721310020-03333e577078?w=800&h=600&fit=crop',
      created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      author_id: users[1]?.id || admin.id,
      content: '💪 Entraînement fractionné intense aujourd\'hui ! 🔥 10x400m avec récupération 90s. Les jambes brûlent mais c\'est ce qui fait progresser 🚀 Merci au coach pour la séance ! #IntervalTraining #NoLimits',
      image: 'https://images.unsplash.com/photo-1513593771513-7b58b6c4af38?w=800&h=600&fit=crop',
      created_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      author_id: admin.id,
      content: '🏅 Préparation marathon de Tunis 2026 : plan d\'entraînement sur 16 semaines ! Cette semaine on démarre avec 40km au compteur. Qui se joint à nous pour cette belle aventure ? 🎯 #MarathonPrep #Goals2026',
      image: 'https://images.unsplash.com/photo-1519315901367-f34ff9154487?w=800&h=600&fit=crop',
      created_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      author_id: users[2]?.id || admin.id,
      content: '🌲 Trail à Ain Draham ce week-end ! 25km de pur bonheur entre forêts et montagnes. La nature tunisienne est juste magnifique 😍 Merci à toute l\'équipe pour cette aventure inoubliable ! #TrailRunning #NatureLove',
      image: 'https://images.unsplash.com/photo-1571008887538-b36bb32f4571?w=800&h=600&fit=crop',
      created_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: randomUUID(),
      author_id: users[3]?.id || admin.id,
      content: '🧘‍♀️ Récupération et stretching après une belle sortie longue de 18km ! L\'importance de bien récupérer pour éviter les blessures 💚 N\'oubliez jamais les étirements les amis ! #Recovery #StretchingTime',
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&h=600&fit=crop',
      created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    },
  ];

  console.log('Adding demo posts...');
  
  for (const post of posts) {
    try {
      dbHelper.createPost(post);
      console.log(`✅ Added post by user ${post.author_id.substring(0, 8)}...`);
      
      // Add some likes to make it look active
      const numLikes = Math.floor(Math.random() * 15) + 5;
      for (let i = 0; i < numLikes && i < users.length; i++) {
        try {
          dbHelper.likePost(post.id, users[i]?.id || admin.id);
        } catch (e) {
          // Ignore duplicate like errors
        }
      }
      console.log(`   💙 Added ${numLikes} likes`);
    } catch (error) {
      console.error(`❌ Failed to add post:`, error);
    }
  }

  console.log(`\n🎉 Successfully added ${posts.length} demo posts!`);
}

addDemoPosts().catch(console.error);
