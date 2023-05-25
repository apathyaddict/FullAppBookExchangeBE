const mongoose = require('mongoose');


const Schema = mongoose.Schema


const bookSchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true,
    },
    author:{
        type: String,
        required: true
    },
    
    genre :{
        type: String,
        required: true
    },
    status:{
        type: String,
        required: true
    }
    ,synopsis:{
        type: String,
        required: false
    },
    language:{
        type: String,
        required: false
    },
    pages :{
        type:Number,
        required: false
    },
    firstPublished:{
        type: String,
        required: false
    },
    authorBio:{
        type: String,
        required: false
    },
    lifeChanging:{
        type: Boolean,
        required: false
    },
    characters:{
        type: [String],
        default: [],
        required: false
    },
    photoURL:{
        type: String,
        required: false
    },

    
}, {timestamps:true})   



module.exports = mongoose.model('Book', bookSchema)