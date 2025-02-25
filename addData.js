import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGO_URI;
const client = new MongoClient(uri);

// Sample car data array
const carsData = [
  {
    name: "Golf mk8",
    price_per_day: 50.0,
    year: 2015,
    color: "black",
    steering_type: "automatic",
    number_of_seats: 5
  },
  {
    name: "Toyota Corolla",
    price_per_day: 45.0,
    year: 2020,
    color: "white",
    steering_type: "automatic",
    number_of_seats: 5
  },
  {
    name: "Ford Focus",
    price_per_day: 40.0,
    year: 2018,
    color: "red",
    steering_type: "manual",
    number_of_seats: 5
  }
];

async function seedDatabase() {
  try {
    await client.connect();
    const db = client.db('carRental');
    
    // Create collections if they don't exist
    await db.createCollection('cars');
    await db.createCollection('users');

    // Insert cars (prevent duplicates)
    const carsCollection = db.collection('cars');
    for (const car of carsData) {
      const exists = await carsCollection.findOne({ name: car.name });
      if (!exists) {
        await carsCollection.insertOne(car);
      }
    }

    // Create indexes for efficient querying
    await carsCollection.createIndex({ price_per_day: 1 });
    await carsCollection.createIndex({ year: 1 });
    await carsCollection.createIndex({ color: 1 });
    
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await client.close();
  }
}

seedDatabase();