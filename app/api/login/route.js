import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { connectDB } from "@/app/lib/connectDB";
import User from "@/app/model/schema";

export async function POST(request) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json({ error: "All fields required" }, { status: 400 });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return Response.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return Response.json({ error: "Invalid email or password" }, { status: 401 });
        }

        const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET || "shopeasy_secret", { expiresIn: "7d" });
        return Response.json({ message: "Login successful", token, user: { id: user._id, email: user.email } });

    } catch (error) {
        console.error(error);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}