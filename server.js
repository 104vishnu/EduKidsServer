// const express = require('express');
// const sqlite3 = require('sqlite3').verbose();
// const bcrypt = require('bcrypt');
// const cors = require('cors'); // Import the cors middleware
// const bodyParser = require('body-parser');


// const app = express();
// const PORT = process.env.PORT || 5000;
// const DB_PATH = './database.db';

// const db = new sqlite3.Database(DB_PATH, (err) => {
//   if (err) console.error('Database connection error:', err.message);
//   else {
//     console.log('Connected to the SQLite database.');
//     db.run(`CREATE TABLE IF NOT EXISTS users (
//       id INTEGER PRIMARY KEY AUTOINCREMENT,
//       username TEXT,
//       email TEXT UNIQUE,
//       phone TEXT,
//       password TEXT
//     )`);
//   }
// });

// app.use(bodyParser.json());
// app.use(cors()); // Enable CORS for all routes

// // Register endpoint
// app.post('/register', (req, res) => {
//   const { username, email, phone, password } = req.body;

//   // Check if any of the required fields are missing
//   if (!username || !email || !phone || !password) {
//     return res.status(400).json({ error: 'All fields are required' });
//   }

//   // Hash the password before storing it in the database
//   bcrypt.hash(password, 10, (err, hashedPassword) => {
//     if (err) {
//       console.error('Password hashing error:', err.message);
//       return res.status(500).json({ error: 'Registration failed' });
//     }

//     // Query to insert the new user into the database
//     const query = `INSERT INTO users (username, email, phone, password) VALUES (?, ?, ?, ?)`;
//     db.run(query, [username, email, phone, hashedPassword], function(err) {
//       if (err) {
//         console.error('Registration error:', err.message);
//         return res.status(500).json({ error: 'Registration failed' });
//       } else {
//         console.log(`A new user has been registered with id ${this.lastID}`);
//         return res.status(200).json({ message: 'Registration successful' });
//       }
//     });
//   });
// });

// // Login endpoint
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   // Check if email and password are provided
//   if (!email || !password) {
//     return res.status(400).json({ error: 'Email and password are required' });
//   }

//   // Query the database to find the user by email
//   const query = `SELECT * FROM users WHERE email = ?`;
//   db.get(query, [email], (err, user) => {
//     if (err) {
//       console.error('Login error:', err.message);
//       return res.status(500).json({ error: 'Login failed' });
//     }

//     // If user is not found
//     if (!user) {
//       console.log('User not found');
//       return res.status(401).json({ error: 'Invalid email or password' });
//     }

//     // Compare the provided password with the hashed password from the database
//     bcrypt.compare(password, user.password, (err, result) => {
//       if (err) {
//         console.error('Password comparison error:', err.message);
//         return res.status(500).json({ error: 'Login failed' });
//       }

//       // If passwords match, login successful
//       if (result) {
//         console.log('Password matches');
//         return res.status(200).json({ 
//           message: 'Login successful',
//           user: {
//             id: user.id,
//             username: user.username,
//             email: user.email,
//             phone: user.phone
//           }
//         });
//       } else {
//         // If passwords do not match
//         console.log('Password does not match');
//         return res.status(401).json({ error: 'Invalid email or password' });
//       }
//     });
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });



import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoute from "./routes/auth.route.js";

const PORT = process.env.PORT || 5000;

const app = express();
dotenv.config();
mongoose.set("strictQuery", true);

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO);
    console.log("Connected to mongoDB!");
  } catch (error) {
    console.log(error);
  }
};

app.use(cors({ origin: "https://edu-kids.vercel.app/", credentials: true }));
app.use(express.json());
app.use(cookieParser());



app.use("/api/v1/auth", authRoute);


app.use((err, req, res, next) => {
    const errorStatus = err.status || 500;
    const errorMessage = err.message || "Something went wrong!";
  
    return res.status(errorStatus).send(errorMessage);
  });
  
  app.listen(PORT, () => {
    connect();
    console.log("Backend server is running!");
  });