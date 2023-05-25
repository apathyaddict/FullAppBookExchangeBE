const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const validator = require('validator')

const Schema = mongoose.Schema

const userSchema = new Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    password:{
        type: String,
        required: true,
    }, 
    firstName:{
        type: String,
        required: true,
    }, 
    lastName:{
        type: String,
        required: true,
    }, 
    phoneNum:{
        type: String,
        required: false,
    },
    userBio:{
      type: String,
      required: false,
    },
    profilePicture:{
      type: String,
      required: false,
    },
//     saved: {
//         // type: [String],
//         // default: []
//         type: mongoose.Schema.Types.ObjectId,
//     ref: 'Book',
//  }, 
saved: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book',
  }
],
 myBooks: [
    {
      bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',
        required: true,
      },
      // bookId: {
      //   type: String,
      //   required: true
      // },
      status: {
        type: String,
        enum: ["available", "borrowed", "kept"],
      }
    
    }
  ], 
  isAdmin: {
    type: Boolean,
    default: false
  }
}

)    

// static signup method
userSchema.statics.signup = async function(email, password, firstName, lastName,phoneNum, _id) {

    //validation
    if(!email || !password || !firstName || !lastName) {
        throw Error('All fields must be filled ')
    }
    if (!validator.isEmail(email)){
        throw Error('Email is not valid')
    }
    if(!validator.isStrongPassword(password)){
        throw Error('Password is not strong enough')
    }
    if(!validator.isMobilePhone(phoneNum)){
        throw Error('enter a phone number')
    }

    const exists = await this.findOne({ email })
  
    if (exists) {
      throw Error('Email already in use')
    }
  
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash(password, salt)
  
    const user = await this.create({ email, password: hash, firstName, lastName, phoneNum, _id })
  
    return user
  }
  

//static login method
userSchema.statics.login = async function (email, password){
  return this.findOne({ email })
      .then(async (user) => {
          if (!user) {
              throw Error('Incorrect email')
          }
          return user;
      });
}

module.exports =  mongoose.model('User', userSchema)