// Script to seed Firebase database with initial events
import { firebaseDB } from './firebaseUtils';

const seedEvents = [
  {
    title: 'Shark Tank: The Pitch Battle',
    description: 'Pitch your visionary ideas to industry titans and secure the mentorship to make them a reality.',
    icon: '🦈',
    price: 299,
    category: 'Business',
    duration: '2 Days',
    prize: 'Seed Funding & Mentorship',
    image: 'https://via.placeholder.com/400x300/FF1A1A/FFFFFF?text=Shark+Tank',
    maxTickets: 50,
  },
  {
    title: 'Digital Arena: Gaming Showdown',
    description: 'Compete in high-stakes tournaments across popular esports titles.',
    icon: '🎮',
    price: 199,
    category: 'Gaming',
    duration: '3 Days',
    prize: '₹50,000 Prize Pool',
    image: 'https://via.placeholder.com/400x300/00FFFF/000000?text=Gaming+Showdown',
    maxTickets: 100,
  },
  {
    title: 'Code Clash',
    description: 'A classic competitive programming battle. Solve complex algorithmic problems.',
    icon: '💻',
    price: 249,
    category: 'Technology',
    duration: '1 Day',
    prize: '₹30,000 & Internships',
    image: 'https://via.placeholder.com/400x300/00FF00/000000?text=Code+Clash',
    maxTickets: 75,
  },
  {
    title: 'Design Duel',
    description: 'Showcase your graphic design prowess in a fast-paced creative challenge.',
    icon: '🎨',
    price: 179,
    category: 'Design',
    duration: '1 Day',
    prize: '₹20,000 & Wacom Tablet',
    image: 'https://via.placeholder.com/400x300/FF00FF/FFFFFF?text=Design+Duel',
    maxTickets: 40,
  },
  {
    title: 'Data Detectives',
    description: 'Analyze complex datasets to uncover hidden insights and present your findings.',
    icon: '🔍',
    price: 229,
    category: 'Analytics',
    duration: '2 Days',
    prize: '₹25,000 & Analytics Course',
    image: 'https://via.placeholder.com/400x300/FFFF00/000000?text=Data+Detectives',
    maxTickets: 35,
  },
  {
    title: 'Story Weavers',
    description: 'Craft compelling narratives in our creative writing and storytelling competition.',
    icon: '✍️',
    price: 149,
    category: 'Creative',
    duration: '1 Day',
    prize: 'Kindle & Publishing Opportunity',
    image: 'https://via.placeholder.com/400x300/FF4500/FFFFFF?text=Story+Weavers',
    maxTickets: 60,
  },
  {
    title: 'Hunt Safari',
    description: 'Embark on a campus-wide digital treasure hunt that will test your wits and teamwork.',
    icon: '🗺️',
    price: 99,
    category: 'Adventure',
    duration: '1 Day',
    prize: '₹15,000 & Goodies',
    image: 'https://via.placeholder.com/400x300/8A2BE2/FFFFFF?text=Hunt+Safari',
    maxTickets: 80,
  },
];

export const seedDatabase = async () => {
  console.log('Seeding database with events...');

  for (const event of seedEvents) {
    try {
      const result = await firebaseDB.createEvent(event);
      if (result.success) {
        console.log(`✅ Created event: ${event.title}`);
      } else {
        console.error(`❌ Failed to create event: ${event.title}`, result.error);
      }
    } catch (error) {
      console.error(`❌ Error creating event: ${event.title}`, error);
    }
  }

  console.log('Database seeding completed!');
};

// Run the seeder if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment - expose to window for manual execution
  window.seedDatabase = seedDatabase;
} else {
  // Node.js environment - run automatically
  seedDatabase();
}
