const express = require ('express');
const router= express.Router();
const { body , validationResult } = require('express-validator')
const userModel = require('../models/user.model');
const fileModel = require('../models/file.model');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const authMiddleware = require('../middlewares/auth')
const cloudinary = require ('../config/cloudinary')

const upload = multer({ storage: multer.memoryStorage() });


router.get('/register',(req, res) => {
    res.render("register");
})

router.post('/register',
    body('email').trim().isEmail().isLength({min : 13}),
    body('username').trim().isLength({min:3}),
    body('password').trim().isLength({ min : 6}),
    async (req , res)=>{ 
    
    const err = validationResult(req);

    if(!err.isEmpty()){
        return res.status(400).json({
            errors: err.array(),
            message: 'Sahi DATA dalo'
        })
    }

    const {email, username , password} = req.body;

    const newUser =await userModel.create({
        
        email,
        username,
        password
    })
     const token = jwt.sign({
        userId : newUser._id ,
        email: newUser.email,
        username: newUser.username
     }, process.env.JWT_SECRET)

    res.cookie( 'token' , token); 

    res.render("home");
})

router.get('/login', ( req , res) => {
    res.render("login");
});

router.post('/login',
    body('username').trim().isLength({ min: 3}),
    body('password').trim().isLength({min : 6}),
    async (req, res )=>{
    
    const err = validationResult(req.body);
    if(!err.isEmpty()){
        res.status(400).json({
            errror: err.array(),
            message: "Invalid data"
        })
    }

    const { username , password } = req.body;

    const user = await userModel.findOne({
        username : username,
        password : password
    })

    if(!user){
       return res.status(400).json({
            message:"username or password is not found"
        })
    }

    const token = jwt.sign({
        userId : user._id,
        username : user.username,
        email: user.email,
    }, process.env.JWT_SECRET)

    res.cookie( 'token' , token);
    
    res.render("home");
})


// index routesss


router.get('/home', authMiddleware , async ( req, res) =>{
    
    const userfiles = await fileModel.find({
        userId :req.user.userId
    })
    res.render('home',{
        files : userfiles
    })
})

router.get('/recent' , (req , res)=>{
    res.render("recent")
})

router.get('/bin' , (req , res)=>{
    res.render("bin")
})

const cloudinaryy= require('../config/cloudinary');

router.post('/file-upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    const buffer = req.file.buffer;

    const uploadToCloudinary = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinaryy.uploader.upload_stream(
          { resource_type: 'auto' },
          (error, result) => {
            if (error) return reject(error);
            return resolve(result);
          }
        );
        stream.end(buffer); // this sends the file
      });

    const result = await uploadToCloudinary();
    

    res.json({ url: result.secure_url });
    console.log (req.file.originalname);
    const { useId , filename , fileUrl , public_id ,uploadedAt } = req.body ;

    const newFile = await fileModel.create({
            userId : req.user.userId,
            filename: req.file.originalname,
            fileUrl: result.secure_url,
            public_id: result.public_id
    })

    } catch (err) {
        console.error("Cloudinary Upload Error:", err);
        res.status(500).json({ message: "Upload failed" });
    }

});

router.post('/delete-file/:id', async (req, res) => {
  console.log("🔥 DELETE ROUTE HIT");
  try {
    const file = await fileModel.findById(req.params.id);

    if (!file) return res.status(404).send("File not found");

    // Step 1: Delete from Cloudinary
    await cloudinary.uploader.destroy(file.public_id);

    // Step 2: Delete from MongoDB
    await fileModel.findByIdAndDelete(req.params.id);

    res.redirect("/user/home"); // or wherever you list the files
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});

module.exports = router;