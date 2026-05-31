import bcrypt from "bcryptjs";
import { connectDB } from "@/app/lib/connectDB";
import User from "@/app/model/schema";

export async function POST(request) {
    try {
        await connectDB();

        const { email, password } = await request.json();

        if (!email || !password) {
            return Response.json({ error: "All fields required" }, { status: 400 });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return Response.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({ email, password: hashedPassword });

        return Response.json({ message: "Signup successful", user: { id: newUser._id, email: newUser.email } }, { status: 201 });

    } catch (error) {
        console.error(error);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}