import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";

// importing all the routes from their positions 
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import bookRoutes from './routes/bookRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';

dotenv.config();
const app = express();

// A more permissive CORS configuration for testing
const corsOptions = {
  origin: '*',
  optionsSuccessStatus: 200 // For legacy browser support
};

//connection of all routes
app.use(cors(corsOptions));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/books', bookRoutes);
app.use('/api/reviews', reviewRoutes);

// connection between the codebase and the database for storage and easy accces of data
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  dbName: 'test' // Explicitly set the database name
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.log(err));

// test API key
app.get('/', (req, res) => res.send("API Running"));

// PORT definition and action
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started on port http://localhost:${PORT}`));
