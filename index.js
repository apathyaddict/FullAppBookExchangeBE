const express = require('express');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const bookRoute = require('./routes/booksRoute');
const usersRoute = require('./routes/usersRoute');
const bodyParser = require('body-parser');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS configuration
const allowCors = (req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://full-app-book-exchange-be.vercel.app'); // Adjust this to a specific domain in a production environment
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  next();
};

app.use(allowCors);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use('/books', bookRoute);
app.use('/users', usersRoute);

// Connect to DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log('Connected to DB and listening on port:', PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
