import mongoose from "mongoose";

const formSchema = new mongoose.Schema({
    email: { type: String, unique: true, lowercase: true, required: true },
    password: { type: String, required: true, minlength: 6 },
}, { timestamps: true });

export default mongoose.models.form || mongoose.model("form", formSchema);