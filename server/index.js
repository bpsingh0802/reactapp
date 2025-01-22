const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./model/User");
const multer = require("multer");
const path = require("path");

dotenv.config();

const app = express();
const port=process.env.PORT||4000;
// Middleware
app.use(express.json());
app.use(cors({
    origin: 'https://reactapp-c6wk.vercel.app', // Your frontend's URL
    credentials: true, // Allow credentials like cookies, Authorization headers, etc.
}));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("Failed to connect to MongoDB", err));

// Session Configuration
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI,
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, // 1 day
}));

// Static Files for Uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Multer Configuration for File Uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true);
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    },
});

// Routes
// app.post("/signup", upload.array("images", 5), async (req, res) => {
//     try {
//         const { name, email, password, twitterHandle, instagramHandle } = req.body;

//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: "Email already exists" });
//         }

//         const hashedPassword = await bcrypt.hash(password, 10);
//         const imagePaths = req.files ? req.files.map(file => file.path) : [];

//         const newUser = new UserModel({
//             name,
//             email,
//             password: hashedPassword,
//             twitterHandle,
//             instagramHandle,
//             images: imagePaths,
//         });

//         const savedUser = await newUser.save();
//         res.status(201).json(savedUser);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: error.message });
//     }
// });
app.post('/signup', async (req, res) => {
  try {
    // Your signup logic here
    res.status(201).json({ message: 'Signup successful!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                req.session.user = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    twitterHandle: user.twitterHandle,
                    instagramHandle: user.instagramHandle,
                    images: user.images,
                };

                res.json("Success");
            } else {
                res.status(401).json("Password doesn't match");
            }
        } else {
            res.status(404).json("No Records found");
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post("/logout", (req, res) => {
    if (req.session) {
        req.session.destroy(err => {
            if (err) {
                res.status(500).json
