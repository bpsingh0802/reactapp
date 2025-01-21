const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        
    },
    twitterHandle: {
        type: String,
        default: "",
    },
    instagramHandle: {
        type: String,
        default: "",
    },
    images: [
        {
            type: String, // Store image file paths or URLs
        }
    ]
}, { timestamps: true }); // Adds `createdAt` and `updatedAt` fields

const UserModel = mongoose.model("users", UserSchema);

module.exports = UserModel;
