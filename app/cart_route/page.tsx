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
    const [items, setItems] = useState<CartItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [removing, setRemoving] = useState<string | null>(null);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        if (!email) { setLoading(false); return; }

        fetch(`/api/cart?email=${email}`)
            .then((r) => r.json())
            .then((data) => { setItems(data.items || []); setLoading(false); });
    }, []);

    const removeItem = async (productId: string) => {
        const email = localStorage.getItem("userEmail");
        if (!email) return;
        setRemoving(productId);
        await fetch("/api/cart/remove", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userEmail: email, productId }),
        });
        setItems((prev) => prev.filter((i) => i.productId !== productId));
        setRemoving(null);
    };

    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap');

                * { box-sizing: border-box; margin: 0; padding: 0; }

                .cart-page {
                    min-height: 100vh;
                    background: #f7f5f0;
                    font-family: 'DM Sans', sans-serif;
                    padding: 2rem 1rem 4rem;
                }

                .cart-container {
                    max-width: 780px;
                    margin: 0 auto;
                }

                .cart-header {
                    display: flex;
                    align-items: baseline;
                    justify-content: space-between;
                    margin-bottom: 2rem;
                    padding-bottom: 1.2rem;
                    border-bottom: 2px solid #1a1a1a;
                }

                .cart-title {
                    font-family: 'Playfair Display', serif;
                    font-size: 2.4rem;
                    color: #1a1a1a;
                    letter-spacing: -0.5px;
                }

                .cart-count {
                    font-size: 0.9rem;
                    color: #888;
                    font-weight: 400;
                    letter-spacing: 0.05em;
                    text-transform: uppercase;
                }

                .back-link {
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                    color: #555;
                    text-decoration: none;
                    font-size: 0.88rem;
                    font-weight: 500;
                    margin-bottom: 1.5rem;
                    transition: color 0.2s;
                    letter-spacing: 0.02em;
                }
                .back-link:hover { color: #1a1a1a; }

                .cart-items {
                    display: flex;
                    flex-direction: column;
                    gap: 0;
                }

                .cart-item {
                    display: flex;
                    align-items: center;
                    gap: 1.5rem;
                    padding: 1.4rem 0;
                    border-bottom: 1px solid #e5e0d8;
                    animation: fadeIn 0.3s ease;
                    transition: opacity 0.3s;
                }

                .cart-item.removing {
                    opacity: 0.4;
                    pointer-events: none;
                }

                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(8px); }
                    to   { opacity: 1; transform: translateY(0); }
                }

                .item-img-wrap {
                    width: 80px;
                    height: 80px;
                    background: #fff;
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.07);
                    overflow: hidden;
                }

                .item-img-wrap img {
                    width: 56px;
                    height: 56px;
                    object-fit: contain;
                }

                .item-info {
                    flex: 1;
                    min-width: 0;
                }

                .item-name {
                    font-size: 1rem;
                    font-weight: 600;
                    color: #1a1a1a;
                    margin-bottom: 0.3rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }

                .item-qty {
                    font-size: 0.85rem;
                    color: #888;
                    font-weight: 400;
                }

                .item-price {
                    font-size: 1.05rem;
                    font-weight: 600;
                    color: #1a1a1a;
                    white-space: nowrap;
                    min-width: 80px;
                    text-align: right;
                }

                .remove-btn {
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: #bbb;
                    padding: 6px;
                    border-radius: 6px;
                    transition: color 0.2s, background 0.2s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    flex-shrink: 0;
                }
                .remove-btn:hover { color: #e53e3e; background: #fff0f0; }

                .cart-footer {
                    margin-top: 2rem;
                    background: #fff;
                    border-radius: 16px;
                    padding: 1.5rem 1.8rem;
                    box-shadow: 0 2px 16px rgba(0,0,0,0.06);
                }

                .subtotal-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    font-size: 0.9rem;
                    color: #888;
                    margin-bottom: 0.8rem;
                }

                .total-row {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-top: 0.8rem;
                    border-top: 1px solid #f0ece6;
                }

                .total-label {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.2rem;
                    color: #1a1a1a;
                }

                .total-amount {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.6rem;
                    color: #1a1a1a;
                    font-weight: 700;
                }

                .checkout-btn {
                    width: 100%;
                    margin-top: 1.2rem;
                    padding: 1rem;
                    background: #1a1a1a;
                    color: #fff;
                    border: none;
                    border-radius: 12px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    letter-spacing: 0.04em;
                    transition: background 0.2s, transform 0.1s;
                }
                .checkout-btn:hover { background: #333; transform: translateY(-1px); }
                .checkout-btn:active { transform: translateY(0); }

                .empty-state {
                    text-align: center;
                    padding: 4rem 2rem;
                }
                .empty-icon {
                    font-size: 4rem;
                    margin-bottom: 1rem;
                    display: block;
                }
                .empty-state h2 {
                    font-family: 'Playfair Display', serif;
                    font-size: 1.5rem;
                    color: #1a1a1a;
                    margin-bottom: 0.5rem;
                }
                .empty-state p { color: #888; margin-bottom: 1.5rem; font-size: 0.95rem; }
                .shop-link {
                    display: inline-block;
                    padding: 0.75rem 2rem;
                    background: #1a1a1a;
                    color: #fff;
                    text-decoration: none;
                    border-radius: 50px;
                    font-weight: 600;
                    font-size: 0.9rem;
                    transition: background 0.2s;
                }
                .shop-link:hover { background: #333; }

                .loading-state {
                    text-align: center;
                    padding: 4rem;
                    color: #888;
                    font-size: 0.95rem;
                }
            `}</style>

            <div className="cart-page">
                <div className="cart-container">
                    <Link href="/" className="back-link">
                        ← Continue Shopping
                    </Link>

                    <div className="cart-header">
                        <h1 className="cart-title">Your Cart</h1>
                        {items.length > 0 && (
                            <span className="cart-count">{itemCount} item{itemCount !== 1 ? "s" : ""}</span>
                        )}
                    </div>

                    {loading ? (
                        <div className="loading-state">Loading your cart...</div>
                    ) : items.length === 0 ? (
                        <div className="empty-state">
                            <span className="empty-icon">🛍️</span>
                            <h2>Your cart is empty</h2>
                            <p>Looks like you haven&apos;t added anything yet.</p>
                            <Link href="/" className="shop-link">Start Shopping</Link>
                        </div>
                    ) : (
                        <>
                            <div className="cart-items">
                                {items.map((item) => (
                                    <div
                                        key={item.productId}
                                        className={`cart-item${removing === item.productId ? " removing" : ""}`}
                                    >
                                        <div className="item-img-wrap">
                                            <img src={item.image} alt={item.name} />
                                        </div>
                                        <div className="item-info">
                                            <p className="item-name">{item.name}</p>
                                            <p className="item-qty">Qty: {item.quantity} × ${item.price.toFixed(2)}</p>
                                        </div>
                                        <p className="item-price">${(item.price * item.quantity).toFixed(2)}</p>
                                        <button
                                            className="remove-btn"
                                            onClick={() => removeItem(item.productId)}
                                            title="Remove item"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>

                            <div className="cart-footer">
                                <div className="subtotal-row">
                                    <span>Subtotal ({itemCount} items)</span>
                                    <span>${total.toFixed(2)}</span>
                                </div>
                                <div className="subtotal-row">
                                    <span>Shipping</span>
                                    <span style={{ color: "#22c55e" }}>Free</span>
                                </div>
                                <div className="total-row">
                                    <span className="total-label">Total</span>
                                    <span className="total-amount">${total.toFixed(2)}</span>
                                </div>
                                <button className="checkout-btn">Proceed to Checkout</button>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
