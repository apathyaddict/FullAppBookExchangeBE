const express = require('express');

require ('dotenv').config();

const PORT = process.env.PORT || 8080

const app = express();
const cors =require('cors')
const mongoose = require('mongoose')
const bookRoute = require ('./routes/booksRoute')
const usersRoute = require('./routes/usersRoute')
const bodyParser = require("body-parser")

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cors({ origin: ['http://localhost:3000','https://booked-omega.vercel.app/']}))

//TODO:maybe remove
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.raw());
app.use('/books', bookRoute)
app.use('/users', usersRoute)


//connect to DB
mongoose.connect(process.env.MONGO_URI)
.then(()=>{
    app.listen(PORT, () =>{
        console.log('connected to DB and listening on port:', PORT)
    })

})
.catch((error)=>{console.log(error)})

