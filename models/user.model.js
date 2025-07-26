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
        unique : true,
        trim : true,
        minlength :[ 3, 'username must be atleast three characters long']
    },
    password:{
        type: String,
        required: true,
        unique : true,
        trim : true,
        minlength :[ 6, 'password must be atleast six characters long']
    }
})

const User = mongoose.model('User', userSchema)

module.exports=User;