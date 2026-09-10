import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    bio: {
      type: String,
      default: "",
    },
    avatar_pub_id: {
      type: String,
      default: "",
    },
    avatar_path: {
      type: String,
      default: "",
    },
    otp: { type: String, default: null },
    isExpiry: { type: Date, default: null },
    isVerify: { type: Boolean, default: false },
    role: {
      type: String,
      default: "customer",
      enum: ["customer", "admin", "seller"],
      trim: true,
    },
  },
  { timestamps: true },
);

let userModel;
try {
  userModel = mongoose.model("User");
} catch (error) {
  userModel = mongoose.model("User", userSchema);
}
export default userModel;
