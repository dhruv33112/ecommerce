"use client";
import { useState } from "react";
import Link from "next/link";
import "./auth.css";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirm, setConfirm] = useState("");
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const strength = (() => {
        if (password.length === 0) return 0;
        if (password.length < 6) return 1;
        if (password.length < 10) return 2;
        return 3;
    })();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        if (password !== confirm) {
            setError("Passwords do not match");
            return;
        }
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch("http://localhost:5000/signup", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || "Something went wrong");
            } else {
                setSuccess("Account created! Redirecting to login…");
                setTimeout(() => {
                    window.location.href = "/login_route";
                }, 1500);
            }
        } catch {
            setError("Could not connect to server. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="blob blob-1" />
            <div className="blob blob-2" />

            <div className="auth-card">
                <Link href="/" className="auth-brand">
                    <img
                        src="https://cdn-icons-png.flaticon.com/128/12391/12391227.png"
                        alt="ShopEasy logo"
                        className="auth-logo"
                    />
                    <span>ShopEasy</span>
                </Link>

                <h1 className="auth-title">Create account</h1>
                <p className="auth-sub">Join ShopEasy and start shopping</p>

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
                                placeholder="Min. 6 characters"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                autoComplete="new-password"
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
                        {/* Password strength bar */}
                        {password.length > 0 && (
                            <div className="strength-bar">
                                <div className={`strength-fill strength-${strength}`} />
                                <span className="strength-label">
                                    {["", "Weak", "Fair", "Strong"][strength]}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="field-group">
                        <label htmlFor="confirm">Confirm Password</label>
                        <div className="input-wrap">
                            <img
                                src="https://cdn-icons-png.flaticon.com/128/3064/3064197.png"
                                alt=""
                                className="input-icon"
                            />
                            <input
                                id="confirm"
                                type={showPassword ? "text" : "password"}
                                placeholder="Re-enter password"
                                value={confirm}
                                onChange={(e) => setConfirm(e.target.value)}
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    {error && <p className="auth-error">{error}</p>}
                    {success && <p className="auth-success">{success}</p>}

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? <span className="spinner" /> : "Create Account"}
                    </button>
                </form>

                <p className="auth-switch">
                    Already have an account?{" "}
                    <Link href="/login_route">Sign in</Link>
                </p>
            </div>
        </div>
    );
}