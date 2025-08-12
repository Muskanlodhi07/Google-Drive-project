const mongoose = require("mongoose");
const bcrypt = require('bcrypt');

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

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Only hash if password is new/changed

  try {
    const salt = await bcrypt.genSalt(10); // generate salt
    this.password = await bcrypt.hash(this.password, salt); // hash password
    next();
  } catch (err) {
    next(err);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};



const User = mongoose.model('User', userSchema)

module.exports=User;