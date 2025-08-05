import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  genre: String,
  description: String,
  coverImage: String,
  averageRating: { type: Number, default: 0 },
}, { timestamps: true, collection: 'books' }); 

export default mongoose.model('Book', bookSchema);
