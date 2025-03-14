
# Car Rental API

A RESTful API for managing car rentals, built with Node.js, Express, and MongoDB. Features user authentication, car listings with filters, and profile management.

## Features

- **User Authentication**
  - Register new users
  - Login with JWT token
  - Protected profile endpoint
- **Car Management**
  - List available cars sorted by price
  - Filter cars by year, color, steering type, and seats
- **Security**
  - Password hashing with bcrypt
  - JWT authentication for protected routes


## Installation


1. Clone the repository:

   ```bash
   git clone https://github.com/Erblin02/Car-Rental-API.git
   cd Car-Rental-API

2. Install dependencies:
  ```bash
  npm install
  ```

3. Create .env file:
 ```bash 
 MONGO_URI=mongodb+srv://username:password@cluster0.0k0ai.mongodb.net/carRental
JWT_SECRET=your_jwt_secret_key
PORT=3000 
```  
    
4. Start the server:
```bash 
node rent.js
```    
## API Endpoints

## Authentication

**Register user**
```bash
  POST /register
```

**Request body:**
```bash
  {
  "fullName": "John Doe",
  "email": "john@example.com",
  "username": "johndoe",
  "password": "securepass123"
}
```

**Login**
```bash
  POST /login
```
**Request body:**
```bash
{
  "username": "johndoe",
  "password": "securepass123"
}
```
## User Profile

**Get Profile (Protected)**
```bash
  GET /my-profile
```
**Headers:**
```bash
  Authorization: Bearer <JWT_TOKEN>
```

## Car Listings

**Get Available Cars**
```bash
  GET /rental-cars
```

- **Query Parameters:**
  - ``` year ``` (number)
  - ```color``` (string)
  - ```steering_type``` (string: "manual"/"automatic")
  - ```number_of_seats``` (number)

  

  **Example:**
  ```bash
  GET /rental-cars?year=2020&color=white
  ```

## Testing

**Register a User**
 ```bash
 curl -X POST http://localhost:3000/register \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Alice Smith",
    "email": "alice@example.com",
    "username": "alice",
    "password": "alicepass123"
  }'
  ```

  **Login**
   ```bash
curl -X POST http://localhost:3000/login \
  -H "Content-Type: application/json" \
  -d '{"username": "alice", "password": "alicepass123"}'
  ```

  **Get Profile**
 ```bash
 curl http://localhost:3000/my-profile \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
 ```

 **Get Cars**
 ```bash
 curl http://localhost:3000/rental-cars
 ```

 ## Dependencies
  - Express.js
  - MongoDB Node Driver
  - JWT
  - Bcryptjs
  - Dotenv
