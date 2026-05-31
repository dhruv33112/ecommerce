"use client";
import { useEffect, useState } from "react";

type Product = {
    _id: string;
    name: string;
    price: number;
    image: string;
    category: string;
};

export default function ProductGrid() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [added, setAdded] = useState<string | null>(null);
    const [filter, setFilter] = useState("All");

    useEffect(() => {
        fetch("/api/products")
            .then((r) => r.json())
            .then((data) => { setProducts(Array.isArray(data) ? data : []); setLoading(false); });
    }, []);

    const addToCart = async (product: Product) => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            alert("Please login to add items to cart");
            return;
        }
        await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                userEmail,
                productId: product._id,
                name: product.name,
                price: product.price,
                image: product.image,
            }),
        });
        setAdded(product._id);
        setTimeout(() => setAdded(null), 1500);
    };

    const categories = ["All", ...Array.from(new Set(products.map((p) => p.category)))];
    const filtered = filter === "All" ? products : products.filter((p) => p.category === filter);

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

                .pg-wrap {
                    min-height: 100vh;
                    background: #0f0f0f;
                    font-family: 'Outfit', sans-serif;
                    padding: 3rem 2rem 5rem;
                }

                .pg-header {
                    text-align: center;
                    margin-bottom: 2.5rem;
                }

                .pg-title {
                    font-family: 'Syne', sans-serif;
                    font-size: clamp(2.2rem, 5vw, 3.5rem);
                    font-weight: 800;
                    color: #fff;
                    letter-spacing: -1px;
                    line-height: 1;
                    margin-bottom: 0.4rem;
                }

                .pg-title span {
                    color: #f5c842;
                }

                .pg-sub {
                    color: #555;
                    font-size: 0.95rem;
                    font-weight: 400;
                }

                .filters {
                    display: flex;
                    gap: 0.5rem;
                    justify-content: center;
                    flex-wrap: wrap;
                    margin-bottom: 2.5rem;
                }

                .filter-btn {
                    padding: 0.45rem 1.1rem;
                    border-radius: 50px;
                    border: 1px solid #2a2a2a;
                    background: transparent;
                    color: #888;
                    font-family: 'Outfit', sans-serif;
                    font-size: 0.85rem;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .filter-btn:hover {
                    border-color: #f5c842;
                    color: #f5c842;
                }

                .filter-btn.active {
                    background: #f5c842;
                    border-color: #f5c842;
                    color: #0f0f0f;
                    font-weight: 600;
                }

                .product-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
                    gap: 1.2rem;
                    max-width: 1200px;
                    margin: 0 auto;
                }

                .card {
                    background: #1a1a1a;
                    border-radius: 16px;
                    overflow: hidden;
                    border: 1px solid #222;
                    transition: transform 0.25s, border-color 0.25s;
                    animation: popIn 0.4s ease both;
                }

                .card:hover {
                    transform: translateY(-4px);
                    border-color: #f5c842;
                }

                @keyframes popIn {
                    from { opacity: 0; transform: scale(0.96) translateY(10px); }
                    to   { opacity: 1; transform: scale(1) translateY(0); }
                }

                .img-wrap {
                    background: #111;
                    height: 200px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    overflow: hidden;
                }

                .img-wrap::after {
                    content: '';
                    position: absolute;
                    inset: 0;
                    background: radial-gradient(ellipse at 50% 50%, rgba(245,200,66,0.06) 0%, transparent 70%);
                }

                .img-wrap img {
                    width: 130px;
                    height: 130px;
                    object-fit: contain;
                    position: relative;
                    z-index: 1;
                    transition: transform 0.3s;
                }

                .card:hover .img-wrap img {
                    transform: scale(1.08);
                }

                .card-body {
                    padding: 1.1rem 1.2rem 1.3rem;
                }

                .cat-tag {
                    display: inline-block;
                    font-size: 0.72rem;
                    font-weight: 600;
                    letter-spacing: 0.1em;
                    text-transform: uppercase;
                    color: #f5c842;
                    margin-bottom: 0.35rem;
                }

                .prod-name {
                    font-family: 'Syne', sans-serif;
                    font-size: 1.05rem;
                    font-weight: 700;
                    color: #fff;
                    margin-bottom: 0.6rem;
                    line-height: 1.3;
                }

                .prod-footer {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    gap: 0.5rem;
                }

                .prod-price {
                    font-size: 1.2rem;
                    font-weight: 700;
                    color: #fff;
                }

                .cart-btn {
                    padding: 0.5rem 1rem;
                    border-radius: 8px;
                    border: none;
                    background: #f5c842;
                    color: #0f0f0f;
                    font-family: 'Outfit', sans-serif;
                    font-size: 0.82rem;
                    font-weight: 700;
                    cursor: pointer;
                    transition: all 0.2s;
                    white-space: nowrap;
                }

                .cart-btn:hover {
                    background: #ffd84d;
                    transform: scale(1.04);
                }

                .cart-btn.added {
                    background: #22c55e;
                    color: #fff;
                }

                .loading-wrap {
                    text-align: center;
                    padding: 5rem;
                    color: #555;
                    font-size: 1rem;
                }
            `}</style>

            <div className="pg-wrap">
                <div className="pg-header">
                    <h1 className="pg-title">Shop <span>Everything</span></h1>
                    <p className="pg-sub">{products.length} products available</p>
                </div>

                {!loading && (
                    <div className="filters">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                className={`filter-btn${filter === cat ? " active" : ""}`}
                                onClick={() => setFilter(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}

                {loading ? (
                    <div className="loading-wrap">Loading products...</div>
                ) : (
                    <div className="product-grid">
                        {filtered.map((product, i) => (
                            <div className="card" key={product._id} style={{ animationDelay: `${i * 0.05}s` }}>
                                <div className="img-wrap">
                                    <img src={product.image} alt={product.name} />
                                </div>
                                <div className="card-body">
                                    <span className="cat-tag">{product.category}</span>
                                    <h3 className="prod-name">{product.name}</h3>
                                    <div className="prod-footer">
                                        <span className="prod-price">${product.price.toFixed(2)}</span>
                                        <button
                                            className={`cart-btn${added === product._id ? " added" : ""}`}
                                            onClick={() => addToCart(product)}
                                        >
                                            {added === product._id ? "✓ Added!" : "Add to Cart"}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
}
