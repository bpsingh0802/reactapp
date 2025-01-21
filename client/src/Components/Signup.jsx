import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { Grid, Link, Button, Paper, TextField, Typography } from "@mui/material";

function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [twitterHandle, setTwitterHandle] = useState("");
    const [instagramHandle, setInstagramHandle] = useState("");
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    const handleSignup = (e) => {
        e.preventDefault();
        
        // Create a FormData object to include images and other fields
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("twitterHandle", twitterHandle);
        formData.append("instagramHandle", instagramHandle);

        // Append multiple images
        images.forEach((image) => {
            formData.append("images", image);
        });

        axios
            .post("http://localhost:3001/signup", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((result) => {
                if (result.status === 201) {
                    navigate("/login");
                }
            })
            .catch((err) => {
                if (err.response && err.response.status === 400) {
                    window.alert("Email already exists. Please use a different email.");
                } else {
                    console.log(err);
                }
            });
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImages(files);
    };

    const paperStyle = {
        padding: "2rem",
        margin: "100px auto",
        borderRadius: "1rem",
        boxShadow: "10px 10px 10px",
    };
    const heading = { fontSize: "2.5rem", fontWeight: "600" };
    const row = { display: "flex", marginTop: "2rem" };
    const btnStyle = {
        marginTop: "2rem",
        fontSize: "1.2rem",
        fontWeight: "700",
        backgroundColor: "blue",
        borderRadius: "0.5rem",
    };

    return (
        <div>
            <Grid align="center" className="wrapper">
                <Paper
                    style={paperStyle}
                    sx={{
                        width: {
                            xs: "80vw", // 0
                            sm: "50vw", // 600
                            md: "40vw", // 900
                            lg: "30vw", // 1200
                            xl: "20vw", // 1536
                        },
                        height: {
                            lg: "80vh", // Adjusted for extra fields
                        },
                    }}
                >
                    <Typography component="h1" variant="h5" style={heading}>
                        Signup
                    </Typography>
                    <form onSubmit={handleSignup}>
                        <TextField
                            style={row}
                            fullWidth
                            type="text"
                            label="Enter Name"
                            name="name"
                            onChange={(e) => setName(e.target.value)}
                        />
                        <TextField
                            style={row}
                            fullWidth
                            label="Email"
                            type="email"
                            placeholder="Enter Email"
                            name="email"
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                            style={row}
                            fullWidth
                            label="Password"
                            type="password"
                            placeholder="Enter Password"
                            name="password"
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <TextField
                            style={row}
                            fullWidth
                            label="Twitter Handle"
                            type="text"
                            placeholder="Enter Twitter Handle"
                            name="twitterHandle"
                            onChange={(e) => setTwitterHandle(e.target.value)}
                        />
                        <TextField
                            style={row}
                            fullWidth
                            label="Instagram Handle"
                            type="text"
                            placeholder="Enter Instagram Handle"
                            name="instagramHandle"
                            onChange={(e) => setInstagramHandle(e.target.value)}
                        />
                        <input
                            style={{ marginTop: "2rem" }}
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleImageChange}
                        />
                        <Button style={btnStyle} variant="contained" type="submit">
                            SignUp
                        </Button>
                    </form>
                    <p>
                        Already have an account?<Link href="/login"> Login</Link>
                    </p>
                </Paper>
            </Grid>
        </div>
    );
}

export default SignUp;
