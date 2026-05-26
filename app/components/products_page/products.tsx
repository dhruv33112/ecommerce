"use client";
import { useEffect, useState } from "react";
import "./products.css";

type Product = {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
};

export default function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading]   = useState(true);
    const [added, setAdded]       = useState<string | null>(null);

    useEffect(() => {
        fetch("/api/products")
            .then((r) => r.json())
            .then((data) => { setProducts(data); setLoading(false); });
    }, []);

    const addToCart = async (product: Product) => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            alert("Please login to add items to cart");
            return;
        }

        await fetch("/api/cart", {
            method:  "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userEmail,
                productId: product._id,
                name:      product.name,
                price:     product.price,
                image:     product.image,
            }),
        });

        setAdded(product._id);
        setTimeout(() => setAdded(null), 1500);
    };

    if (loading) return <p>Loading products...</p>;

    return (
        <div className="container">
            <h2 className="heading">Our Products</h2>
            <div className="product-grid">
                {products.map((product) => (
                    <div className="card" key={product._id}>
                        <img src={product.image} alt={product.name} className="product-image" />
                        <div className="card-content">
                            <p className="product-category">{product.category}</p>
                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-price">${product.price.toFixed(2)}</p>
                            <button
                                className="cart-btn"
                                onClick={() => addToCart(product)}
                                style={added === product._id ? { background: "green" } : {}}
                            >
                                {added === product._id ? "✓ Added!" : "Add to Cart"}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}