import mongoose, { Schema } from "mongoose";

export const userSchema = new Schema({
  userName: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is require"],
    trim: true,
  },
  verifyOtp: {
    type: String,
    default: null,
  },
  verifyOtpExpireAt: {
    type: Number,
    default: null,
  },
  isAccountVerified: {
    type: Boolean,
    default: false,
  },
  resetOtp: {
    type: String,
    default: null,
  },
  resetOtpExpireAt: {
    type: Number,
    default: null,
  },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
