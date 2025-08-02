const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique : true,
        trim : true,
    },
    username:{
        type: String,
        required: true,
        unique : true ,
        trim : true,
        minlength :[ 3, 'Username must be atleast three characters long']
    },
    password:{
        type: String,
        required: true,
        trim : true,
        minlength :[ 6, 'Password must be atleast six characters long']
    },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'File'
  }]
})

const User = mongoose.model('User', userSchema)

module.exports=User;