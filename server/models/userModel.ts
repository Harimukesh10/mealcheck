import mongoose, { Schema } from "mongoose";

interface User extends Document {
  username: string;
  password: string;
  role: string;
  email: string;
  phone: string;
  refreshToken: string;
}

const userSchema: Schema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true},
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  email: { type: String, required: false, unique: true },
  phone: { type: String, required: true },
  refreshToken: { type: String, default: '' }
}, { timestamps: true });


export default mongoose.model<User>('User', userSchema);