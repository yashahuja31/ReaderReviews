import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Book from './models/book.js'; // Assuming your Book model is in ./models/book.js
import booksData from './book-details.json' assert { type: 'json' };

dotenv.config();

const seedDB = async () => {
  try {
    // Connect to the database
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB connected successfully for seeding.");

    // Clear existing data
    await Book.deleteMany({});
    console.log("Existing books removed.");

    // Insert new data
    await Book.insertMany(booksData);
    console.log("Database seeded successfully with new books!");

    await mongoose.connection.close();
    console.log("Database connection closed.");

  } catch (err) {
    console.error("Error seeding the database:", err);
    await mongoose.connection.close();
  }
};

seedDB();
