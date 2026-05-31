require("dotenv").config({ path: "./.env.local" });
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./model/productSchema");
const Cart = require("./model/cartSchema");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

const User = mongoose.model("form", UserSchema);


// ── SIGNUP ──────────────────────────────────────────────────
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

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword });

        res.status(201).json({
            message: "Signup successful",
            user: { id: user._id, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


// ── LOGIN ───────────────────────────────────────────────────
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

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "shopeasy_secret", { expiresIn: "7d" });
        res.json({
            message: "Login successful",
            token,
            user: { id: user._id, email: user.email },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
});


// ── GET all products ────────────────────────────────────────
app.get("/products", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


// ── ADD to cart ─────────────────────────────────────────────
app.post("/cart/add", async (req, res) => {
    try {
        const { userEmail, productId, name, price, image } = req.body;

        let cart = await Cart.findOne({ userEmail });

        if (!cart) {
            cart = new Cart({ userEmail, items: [] });
        }

        const existingItem = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.items.push({ productId, name, price, image, quantity: 1 });
        }

        await cart.save();
        res.json({ message: "Added to cart", cart });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


// ── GET cart ────────────────────────────────────────────────
app.get("/cart/:userEmail", async (req, res) => {
    try {
        const cart = await Cart.findOne({ userEmail: req.params.userEmail });
        res.json(cart || { items: [] });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


// ── REMOVE item from cart ───────────────────────────────────
app.delete("/cart/remove", async (req, res) => {
    try {
        const { userEmail, productId } = req.body;
        const cart = await Cart.findOne({ userEmail });
        if (!cart) return res.status(404).json({ error: "Cart not found" });

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        );

        await cart.save();
        res.json({ message: "Item removed", cart });
    } catch (err) {
        res.status(500).json({ error: "Server error" });
    }
});


app.listen(5000, () => console.log("Server running on port 5000"));