require("dotenv").config({ path: "./.env.local" });
const mongoose = require("mongoose");
const Product = require('./model/productSchema');

mongoose.connect(process.env.MONGODB_URI).then(async () => {
    console.log("Connected");

    await Product.deleteMany(); // clear old data

    await Product.insertMany([
        { name: "Classic White Shirt", price: 29.99, image: "https://cdn-icons-png.flaticon.com/512/2331/2331716.png", category: "Men" },
        { name: "Summer Floral Dress", price: 49.99, image: "https://cdn-icons-png.flaticon.com/128/6997/6997662.png", category: "Women" },
        { name: "Running Sneakers", price: 89.99, image: "https://cdn-icons-png.flaticon.com/128/2742/2742687.png", category: "Shoes" },
        { name: "Leather Watch", price: 129.99, image: "https://cdn-icons-png.flaticon.com/128/3674/3674333.png", category: "Accessories" },
        { name: "Scented Candle Set", price: 24.99, image: "https://cdn-icons-png.flaticon.com/128/1698/1698720.png", category: "Home & Living" },
        { name: "Lipstick Collection", price: 19.99, image: "https://cdn-icons-png.flaticon.com/128/1807/1807383.png", category: "Beauty" },
        { name: "Wireless Earbuds", price: 59.99, image: "https://cdn-icons-png.flaticon.com/128/4854/4854246.png", category: "Electronics" },
        { name: "Denim Jacket", price: 79.99, image: "https://cdn-icons-png.flaticon.com/512/2331/2331716.png", category: "Men" },
        { name: "Sunglasses", price: 34.99, image: "https://cdn-icons-png.flaticon.com/128/2589/2589175.png", category: "Accessories" },
        { name: "Yoga Mat", price: 44.99, image: "https://cdn-icons-png.flaticon.com/128/2964/2964514.png", category: "Sports" },
    ]);

    console.log("Products seeded!");
    process.exit();
});