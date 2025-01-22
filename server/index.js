const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const UserModel = require("./model/User");
const multer = require("multer");
const path = require('path');



dotenv.config();

const app = express();
app.use(express.json());
app.use(cors({
    origin: 'https://reactapp-c6wk.vercel.app', // Add a comma here
    credentials: true,
}));



mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Failed to connect to MongoDB', err));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URI
    }),
    cookie: { maxAge: 24 * 60 * 60 * 1000 } // 1 day
}));

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));






// app.post("/signup", async (req, res) => {
//     try {
//         const { name, email, password } = req.body;
//         const existingUser = await UserModel.findOne({ email });
//         if (existingUser) {
//             return res.status(400).json({ error: "Email already exists" });
//         }
//         const hashedPassword = await bcrypt.hash(password, 10);
//         const newUser = new UserModel({ name, email, password: hashedPassword });
//         const savedUser = await newUser.save();
//         res.status(201).json(savedUser);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/"); // Directory to save uploaded images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname); // Unique filename
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB file size limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true); // Accept only images
        } else {
            cb(new Error("Only image files are allowed"), false);
        }
    },
});

app.post("/signup", upload.array("images", 5), async (req, res) => {
    try {
        const { name, email, password, twitterHandle, instagramHandle } = req.body;

        // Check if the email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "Email already exists" });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Get the uploaded images
        const imagePaths = req.files ? req.files.map(file => file.path) : [];

        // Create a new user object
        const newUser = new UserModel({
            name,
            email,
            password: hashedPassword,
            twitterHandle,
            instagramHandle,
            images: imagePaths,
        });

        // Save the user in the database
        const savedUser = await newUser.save();

        // Return the saved user data
        res.status(201).json(savedUser);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});


// app.post("/login", async (req, res) => {
//     try {
//         const { email, password } = req.body;
//         const user = await UserModel.findOne({ email });
//         if (user) {
//             const passwordMatch = await bcrypt.compare(password, user.password);
//             if (passwordMatch) {
//                 req.session.user = { id: user._id, name: user.name, email: user.email };
//                 // console.log(email);
//                 console.log(user.name);
//                 res.json("Success");
//             } else {
//                 res.status(401).json("Password doesn't match");
//             }
//         } else {
//             res.status(404).json("No Records found");
//         }
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await UserModel.findOne({ email });

        if (user) {
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (passwordMatch) {
                // Store the user details including twitterHandle, instagramHandle, and images
                req.session.user = {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    twitterHandle: user.twitterHandle,
                    instagramHandle: user.instagramHandle,
                    images: user.images,  // Store image paths in the session
                };

                console.log(`Logged in as: ${user.name}`);
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
                res.status(500).json({ error: "Failed to logout" });
            } else {
                res.status(200).json("Logout successful");
            }
        });
    } else {
        res.status(400).json({ error: "No session found" });
    }
});

app.get('/user', (req, res) => {
    if (req.session.user) {
        res.json({ user: req.session.user });
    } else {
        res.status(401).json("Not authenticated");
    }
});
