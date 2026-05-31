"use client";
import { useState } from "react";
import Link from "next/link";
import "./form.css";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await fetch("/api/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
            } else {
                localStorage.setItem("userEmail", email);
                localStorage.setItem("token", data.token);
                window.location.href = "/";
            }
        } catch {
            setError("Could not connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            {/* Background blobs */}
            <div className="blob blob-1" />
            <div className="blob blob-2" />

            <div className="auth-card">
                {/* Logo */}
                <Link href="/" className="auth-brand">
                    <img
                        src="https://cdn-icons-png.flaticon.com/128/2662/2662503.png"
                        alt="ShopEasy logo"
                        className="auth-logo"
                    />
                    <span>ShopEasy</span>
                </Link>

                <h1 className="auth-title">Welcome back</h1>
                <p className="auth-sub">Sign in to your account to continue</p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <div className="input-wrap">
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/732/732200.png"
                                alt=""
                                className="input-icon"
                            />
                            <input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                            />
                        </div>
                    </div>

                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <div className="input-wrap">
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/3064/3064197.png"
                                alt=""
                                className="input-icon"
                            />
                            <input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="current-password"
                            />
                            <button
                                type="button"
                                className="toggle-pw"
                                onClick={() => setShowPassword((v) => !v)}
                                aria-label="Toggle password visibility"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? (
                            <span className="spinner" />
                        ) : (
                            "Sign In"
                        )}
                    </button>
                </form>

                <p className="auth-switch">
                    Don&apos;t have an account?{" "}
                    <Link href="/signup_route">Create one</Link>
                </p>
            </div>
        </div>
    );
}