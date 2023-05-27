const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bookRoute = require('./routes/booksRoute');
const usersRoute = require('./routes/usersRoute');

const PORT = process.env.PORT || 8080;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use('/books', bookRoute);
app.use('/users', usersRoute);

// CORS middleware
const allowCors = (fn) => async (req, res) => {
    const allowedOrigins = ['http://localhost:8080', 'https://full-app-book-exchange-be.vercel.app'];
    const origin = req.headers.origin;
  
    if (allowedOrigins.includes(origin)) {
      res.setHeader('Access-Control-Allow-Credentials', 'true');
      res.setHeader('Access-Control-Allow-Origin', origin);
      res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS, PATCH, DELETE, POST, PUT');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      );
  
      if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
      }
    } else {
      // Handle invalid or disallowed origin
      res.status(403).json({ error: 'Invalid origin' });
      return;
    }
  
    return await fn(req, res);
  };

// Handler with CORS middleware
const handler = allowCors((req, res) => {
  const d = new Date();
  res.end(d.toString());
});

app.use(handler);

// Connect to DB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Connected to DB and listening on port:', PORT);
    });
  })
  .catch((error) => {
    console.log('Error connecting to DB:', error);
  });
