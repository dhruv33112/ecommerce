require("dotenv").config({ path: "./.env.local" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");


const app = express();

app.use(cors());
app.use(express.json());

mongoose
    .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/shopeasy")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("DB error:", err));


const UserSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            lowercase: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
            minlength: 6,
        },
    },
    { timestamps: true }
);

const User = mongoose.model("form", UserSchema); // was: mongoose.model("form", formSchema) — formSchema was undefined



app.post("/signup", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: "User already exists" });
        }

        
        const user = await User.create({ email, password });

        res.status(201).json({
            message: "Signup successful",
            user: { id: user._id, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


// ── LOGIN ───────────────────────────────────────────────────────────────────
app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "All fields required" });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        if (user.password !== password) { 

            return res.status(401).json({ error: "Invalid email or password" });
        } 
        

        res.json({
            message: "Login successful",
            user: { id: user._id, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


app.listen(5000, () => console.log("Server running on port 5000"));