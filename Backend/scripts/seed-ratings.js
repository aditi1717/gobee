const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../.env') });

const User = require('../models/User');
const Booking = require('../models/Booking');
const Vendor = require('../models/Vendor');
const Service = require('../models/Service');
const Category = require('../models/Category');

async function run() {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb+srv://gobeestoresin_db_user:qICfoR85UZTt7LqP@cluster0.9pobgt0.mongodb.net/gobee';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected successfully!');

    // Find the test user
    const user = await User.findOne({ phone: '6264560457' });
    if (!user) {
      console.log('Test user with phone 6264560457 not found!');
      return;
    }
    console.log('Found user:', user.name, user._id);

    // Find some vendors
    const vendors = await Vendor.find().limit(3);
    if (vendors.length === 0) {
      console.log('No vendors found in DB to associate!');
      return;
    }

    // Find some services
    const services = await Service.find().limit(3);
    if (services.length === 0) {
      console.log('No services found in DB!');
      return;
    }

    // Find categories
    const categories = await Category.find().limit(3);

    console.log('Clearing existing rated bookings for user...');
    await Booking.deleteMany({ userId: user._id, rating: { $ne: null } });

    // Seed mock reviews
    const mockReviews = [
      {
        rating: 5,
        review: "Excellent service! The technician arrived right on time and fixed our AC issue immediately. Highly recommend Go Bee!",
        serviceName: "AC Deep Cleaning",
        bookingNumber: "GB-100234"
      },
      {
        rating: 4,
        review: "Very professional haircut and styling. The stylist was polite and took their time to understand what I wanted.",
        serviceName: "Men's Haircut & Grooming",
        bookingNumber: "GB-998122"
      },
      {
        rating: 5,
        review: "Superb house cleaning! Every corner was dusted and mopped perfectly. Friendly professionals.",
        serviceName: "Full Home Deep Cleaning",
        bookingNumber: "GB-102431"
      }
    ];

    for (let i = 0; i < mockReviews.length; i++) {
      const reviewData = mockReviews[i];
      const vendor = vendors[i % vendors.length];
      const service = services[i % services.length];
      const category = categories[i % categories.length];

      await Booking.create({
        bookingNumber: reviewData.bookingNumber,
        userId: user._id,
        vendorId: vendor._id,
        serviceId: service._id,
        categoryId: category ? category._id : null,
        serviceName: reviewData.serviceName,
        status: 'completed',
        paymentStatus: 'success',
        paymentMethod: 'wallet',
        finalAmount: 499 + i * 150,
        scheduledDate: new Date(Date.now() - (i + 1) * 3 * 24 * 60 * 60 * 1000),
        scheduledTime: '10:00 AM - 11:00 AM',
        address: {
          addressLine1: 'Flat 402, Sunshine Heights',
          city: 'Indore',
          state: 'Madhya Pradesh',
          pincode: '452001'
        },
        rating: reviewData.rating,
        review: reviewData.review,
        reviewedAt: new Date(Date.now() - (i + 1) * 2 * 24 * 60 * 60 * 1000),
        reviewImages: []
      });
      console.log('Created rated booking:', reviewData.bookingNumber);
    }
    console.log('Ratings seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding ratings:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

run();
