"use client";
import { use, useState } from "react";
import "./Products.css";
export default function ProductCard() {
  const products = [
    {
      id: 1,
      name: "Urban Backpack",
      price: "$49.99",
      image:
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
    },
    {
      id: 2,
      name: "Classic Sneakers",
      price: "$59.99",
      image:
        "https://images.unsplash.com/photo-1549298916-b41d501d3772",
    },
    {
      id: 3,
      name: "Leather Watch",
      price: "$89.99",
      image:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    },
    {
      id: 4,
      name: "Headphones",
      price: "$69.99",
      image:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
    },
  ];
  const [count, setCount] = useState([0,0,0,0]);
  const increase = (index: number) => {
    const updated = [...count];
    updated[index]++;
    setCount(updated);
  };

  const decrease = (index: number) => {
    const updated = [...count];

    if (updated[index] > 0) {
      updated[index]--;
    }

    setCount(updated);
  };

   return (
    <main className="container">
      <h1 className="heading">Featured Products</h1>

      <div className="product-grid">
        {products.map((product , index) => (
          <div className="card" key={product.id}>
            <img
              src={product.image}
              alt={product.name}
              className="product-image"
            />

            <div className="card-content">
              <h2 className="product-name">{product.name}</h2>

              <p className="product-price">{product.price}</p>
               <div className="count">
                <button onClick={() => decrease(index)}>
                  -
                </button>

                <p>{count[index]}</p>

                <button onClick={() => increase(index)}>
                  +
                </button>
              <button className="cart-btn">
                Add to Cart
              </button>
              </div>
              
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}