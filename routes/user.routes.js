const express = require ('express');
const router= express.Router();
const { body , validationResult } = require('express-validator')
const userModel = require('../models/user.model');
const fileModel = require('../models/file.model');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const authMiddleware = require('../middlewares/auth')
const cloudinary = require ('../config/cloudinary')
const nodemailer = require('nodemailer');
const streamifier = require("streamifier");

const upload = multer({ storage: multer.memoryStorage() });


router.get('/register',(req, res) => {
    res.render("register");
});

router.post(
  '/register',
  [
    body('email').trim().isEmail().isLength({ min: 13 }),
    body('username').trim().isLength({ min: 3 }),
    body('password').trim().isLength({ min: 6 }),
  ],
  async (req, res) => {
    const err = validationResult(req);
    if (!err.isEmpty()) {
      return res.status(400).json({ error: "Validation failed", details: err.array() });
    }

    const { email, username, password } = req.body;

    try {
      const newUser = await userModel.create({ email, username, password });

      const token = jwt.sign(
        {
          userId: newUser._id,
          email: newUser.email,
          username: newUser.username,
        },
        process.env.JWT_SECRET
      );

      res.cookie('token', token);
      res.status(200).json({
        success: true,
        redirectTo: "/user/home"
      });

    } catch (error) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        const value = error.keyValue[field];

        return res.status(400).json({
          error: "Duplicate",
          field: field,
          message: `${field} "${value}" is already in use`,
        });
      }

      console.log(error);
      return res.status(500).json({ error: "Something went wrong", message: error.message });
    }
  }
);

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
    })

    if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
    } else {
    const token = jwt.sign(
      {
        userId: user._id,
        username: user.username,
        email: user.email,
      },
      process.env.JWT_SECRET
    );

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    res.cookie("token", token, { httpOnly: true });

    return res.status(200).json({ message: "Login successful" });
  }

})


// index routesss


router.get('/home', authMiddleware, async (req, res) => {
  const userfiles = await fileModel.find({
    userId: req.user.userId,
    deleted: false
  });

  // fetch user by _id and populate the actual favorite file documents
  const newuser = await userModel.findById(req.user.userId).populate('favorites');

  // normalize favorites to string IDs so .includes works in EJS
  const userForTemplate = {
    ...newuser.toObject(),
    favorites: Array.isArray(newuser.favorites)
      ? newuser.favorites.map(f => f._id.toString())
      : []
  };

  res.render('home', {
    files: userfiles,
    user: userForTemplate
  });
});

router.get('/about',authMiddleware, (req,res)=>{
  res.render("about");
})


router.get('/recent' ,authMiddleware, async (req , res)=>{
    const userfiles = await fileModel.find({
    userId :req.user.userId
    })
    res.render('recent',{
        files : userfiles
    })
})

router.get('/bin', authMiddleware, async (req, res) => {
  const deletedFiles = await fileModel.find({ 
    userId: req.user.userId,
    deleted: true
});
  res.render('bin', { deletedFiles });
});


router.post('/file-upload', authMiddleware, upload.single('file'), async (req, res) => {
  try {
    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          filename_override: req.file.originalname, // e.g. "ANAMIKA_LODHI.pdf"
          use_filename: true,
          unique_filename: false,
          resource_type: 'raw',
          folder: 'user_uploads'  // optional, for organization
        },
        (error, result) => {
          if (error) return reject(error);
        console.log(result);
        return resolve(result);
          
        }
      ).end(req.file.buffer);
    });

    await fileModel.create({
      userId: req.user.userId,
      filename: req.file.originalname,
      fileUrl: result.secure_url,
      public_id: result.public_id,
      resource_type: result.resource_type
    });
  
    return res.status(200).json({ message: "Upload successful", url: result.secure_url });
  } catch (err) {
    console.error("Upload failed:", err);
    return res.status(500).json({ message: "Upload failed", error: err.message });
  }
});




// POST /file/delete/:id
router.post('/file/delete/:id', authMiddleware, async (req, res) => {
  try {
    const file = await fileModel.findById(req.params.id);
      await fileModel.findByIdAndDelete(req.params.id);
       // Hard delete
       
    // Step 1: Delete from Cloudinary
    await cloudinary.uploader.destroy(file.public_id);
    
    res.redirect('/user/bin');
  } catch (err) {
    res.status(500).send('Error deleting file');
     console.log(err);
  }
 
});


router.post('/delete-file/:id', async (req, res) => {
  console.log("🔥 DELETE ROUTE HIT");
  try {
    const file = await fileModel.findById(req.params.id);

    if (!file) return res.status(404).send("File not found");

    // Step 2: Delete from MongoDB
    await fileModel.findByIdAndUpdate(req.params.id , {
        deleted: true,
        deletedAt: new Date()
    });

    res.redirect("/user/home"); // or wherever you list the files
  } catch (err) {
    console.error(err);
    res.status(500).send("Something went wrong");
  }
});
// POST /file/restore/:id
router.post('/file/restore/:id', authMiddleware, async (req, res) => {
  try {
    await fileModel.findByIdAndUpdate(req.params.id, {
      deleted: false,
      deletedAt: null
    });
    res.redirect('/user/bin');
  } catch (err) {
    res.status(500).send('Error restoring file');
  }
});

router.post('/toggle-favorite/:fileId', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    const { fileId } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await userModel.findById( userId ).exec();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    // Ensure favorites array exists
    if (!Array.isArray(user.favorites)) user.favorites = [];

    const idx = user.favorites.findIndex(fav => fav.toString() === fileId);
    let isNowFavorite;
    if (idx > -1) {
      // remove
      user.favorites.splice(idx, 1);
      isNowFavorite = false;
    } else {
      user.favorites.push(fileId);
      isNowFavorite = true;
    }

    await user.save();

    res.json({ success: true, isFavorite: isNowFavorite });
  } catch (err) {
    console.error('toggle-favorite error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// JSON endpoint for current favorites (can be polled by favorites page)
router.get('/favorite-json', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId || req.session?.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const user = await userModel.findOne({ userId }).populate('favorites').exec();
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const favorites = Array.isArray(user.favorites)
      ? user.favorites.map(f => ({
          _id: f._id,
          filename: f.filename || f.name || '',
          fileUrl: f.fileUrl || '',
          uploadedAt: f.uploadedAt || ''
        }))
      : [];

    res.json({ success: true, favorites });
  } catch (err) {
    console.error('favorite-json error', err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// Render favorites page
router.get('/favorite', authMiddleware, async (req, res) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).send('Unauthorized');

    // Get user by _id and populate the favorites array
    const user = await userModel.findById(userId).populate('favorites').exec();
    if (!user) return res.status(404).send('User not found');

    const files = Array.isArray(user.favorites) ? user.favorites : [];
    res.render('favorites', { files });
  } catch (err) {
    console.error('Error rendering favorites page:', err);
    res.status(500).send('Server error');
  }
});

router.post('/send-message' , async (req , res)=>{
  const{ name , email , message} = req.body;

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true for 465, false for 587
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_PASS
  }
});
console.log('EMAIL:', process.env.GMAIL_USER);
console.log('PASS:', process.env.GMAIL_PASS);


  const mailOptions = { 
    from: email,
    to: process.env.GMAIL_USER,
    subject: `New message from ${name}`,
    text: `Message from: ${name} (${email})\n\n${message}`
  };
  try{
    await transporter.sendMail(mailOptions);
    res.status(200).send('message sent successfully!')
  }catch(error){
    console.log(error);
    res.status(500).send('something went wrong');
  }
 console.log(req.body);
});

module.exports = router;