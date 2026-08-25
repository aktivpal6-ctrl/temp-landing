import mongoose from "mongoose";

const WaitlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      default: "",
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      default: "",
      trim: true,
    },
    instagram: {
      type: String,
      default: "",
      trim: true,
    },
  },
  { timestamps: true },
);

export default mongoose.models.Waitlist || mongoose.model("Waitlist", WaitlistSchema, "waitlist");
