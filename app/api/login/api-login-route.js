import { connectDB } from "@/lib/connectDB";
import User from "@/models/schema";

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

        if (user.password !== password) {
            return Response.json({ error: "Invalid email or password" }, { status: 401 });
        }

        return Response.json({ message: "Login successful", user: { id: user._id, email: user.email } });

    } catch (error) {
        console.error(error);
        return Response.json({ error: "Server error" }, { status: 500 });
    }
}