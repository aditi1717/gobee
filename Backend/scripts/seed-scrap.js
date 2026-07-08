const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const User = require('../models/User');
const Scrap = require('../models/Scrap');

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB successfully');

    const phoneFormats = ['6264560457', '+916264560457', '+91 6264560457'];
    const user = await User.findOne({ phone: { $in: phoneFormats } });

    if (!user) {
      console.error('User with phone 6264560457 not found in DB');
      process.exit(1);
    }

    console.log(`Found user: ${user.name} (${user._id})`);

    // Clean existing scrap listings to start fresh
    await Scrap.deleteMany({ userId: user._id });
    console.log('Cleared existing scrap listings for user');

    const mockScraps = [
      {
        userId: user._id,
        title: 'AC Copper Wire & Pipes',
        description: 'Heavy copper wiring and pipe scraps removed during air conditioner servicing. Approx 5 kg.',
        images: ['https://images.unsplash.com/photo-1558486012-817176f84c6d?auto=format&fit=crop&w=400&q=80'],
        address: {
          addressLine1: 'Shivam Complex, 14, Maharani Rd, Siyaganj',
          city: 'Indore',
          state: 'Madhya Pradesh',
          pincode: '452007'
        },
        status: 'pending'
      },
      {
        userId: user._id,
        title: 'Old Newspaper & Cardboards',
        description: 'Newspapers collected over 6 months and several heavy cardboard shipping boxes.',
        images: ['https://images.unsplash.com/photo-1588600878108-57c6118274d8?auto=format&fit=crop&w=400&q=80'],
        address: {
          addressLine1: 'Shivam Complex, 14, Maharani Rd, Siyaganj',
          city: 'Indore',
          state: 'Madhya Pradesh',
          pincode: '452007'
        },
        status: 'accepted',
        pickupDate: new Date(Date.now() + 86400000) // Tomorrow
      },
      {
        userId: user._id,
        title: 'Discarded Iron Rods & Grills',
        description: 'Leftover metal rods and window grills from recent home renovation work.',
        images: ['https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=400&q=80'],
        address: {
          addressLine1: 'Shivam Complex, 14, Maharani Rd, Siyaganj',
          city: 'Indore',
          state: 'Madhya Pradesh',
          pincode: '452007'
        },
        status: 'completed',
        finalPrice: 480
      }
    ];

    const inserted = await Scrap.insertMany(mockScraps);
    console.log(`Successfully seeded ${inserted.length} scrap listings!`);
  } catch (error) {
    console.error('Seeding failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
