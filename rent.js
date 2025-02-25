// rent.js
import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// MongoDB connection setup
const client = new MongoClient(process.env.MONGO_URI);
let db;

// Connect to MongoDB and start server
client.connect()
  .then(() => {
    db = client.db('carRental');
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Authentication middleware
const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'No token provided' });
  
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.collection('users').findOne({ 
      _id: new ObjectId(decoded.userId) 
    });
    if (!user) return res.status(401).json({ message: 'User not found' });
    req.user = user;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Routes
app.post('/register', async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;
    
    if (!fullName || !email || !username || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check for existing user
    const existingUser = await db.collection('users').findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      return res.status(409).json({ message: 'Username or email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create new user
    const newUser = {
      fullName,
      email,
      username,
      password: hashedPassword,
      createdAt: new Date()
    };

    // Insert user
    const result = await db.collection('users').insertOne(newUser);
    
    res.status(201).json({
      message: 'User registered successfully',
      userId: result.insertedId
    });
  } catch (err) {
    console.error('Registration error:', err);
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
});

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required' });
    }

    // Find user
    const user = await db.collection('users').findOne({ username });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) return res.status(401).json({ message: 'Invalid credentials' });

    // Generate JWT
    const token = jwt.sign(
      { userId: user._id.toString() }, 
      process.env.JWT_SECRET, 
      { expiresIn: '1h' }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
});

app.get('/my-profile', authMiddleware, (req, res) => {
  res.json({
    fullName: req.user.fullName,
    email: req.user.email,
    username: req.user.username
  });
});

app.get('/rental-cars', async (req, res) => {
  try {
    const { year, color, steering_type, number_of_seats } = req.query;
    const filter = {};
    
    if (year) filter.year = parseInt(year);
    if (color) filter.color = color;
    if (steering_type) filter.steering_type = steering_type;
    if (number_of_seats) filter.number_of_seats = parseInt(number_of_seats);

    const cars = await db.collection('cars')
      .find(filter)
      .sort({ price_per_day: 1 })
      .toArray();
      
    res.json(cars);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cars', error: err.message });
  }
});