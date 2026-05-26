"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
    productId: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
};

export default function CartPage() {
    const [items, setItems]   = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (!email) { setLoading(false); return; }

        fetch(`/api/cart?email=${email}`)
            .then((r) => r.json())
            .then((data) => { setItems(data.items || []); setLoading(false); });
    }, []);

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (loading) return <p>Loading cart...</p>;

    return (
        <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
            <h1>Your Cart</h1>
            {items.length === 0 ? (
                <p>Your cart is empty. <Link href="/">Continue shopping</Link></p>
            ) : (
                <>
                    {items.map((item) => (
                        <div key={item.productId} style={{ display: "flex", gap: "1rem", marginBottom: "1rem", borderBottom: "1px solid #eee", paddingBottom: "1rem" }}>
                            <img src={item.image} alt={item.name} style={{ width: 60, height: 60, objectFit: "contain" }} />
                            <div>
                                <p><strong>{item.name}</strong></p>
                                <p>${item.price.toFixed(2)} × {item.quantity}</p>
                            </div>
                        </div>
                    ))}
                    <h3>Total: ${total.toFixed(2)}</h3>
                </>
            )}
        </div>
    );
}