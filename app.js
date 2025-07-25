const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const userRouter = require('./routes/user.routes'); 
const connectToDB = require('./config/db');
const dotenv = require("dotenv");
const { cookie } = require('express-validator');
dotenv.config();
connectToDB();


app.set('view engine', 'ejs');
app.use(cookieParser()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



 
app.use("/user" , userRouter);


app.listen(3000, () => {
    console.log("app is running on port 3000");
});

