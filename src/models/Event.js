import mongoose from "mongoose";

const EventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    location_link: {
      type: String,
      default: "",
      trim: true,
    },
    start_time: {
      type: Date,
      required: true,
    },
    duration: {
      type: String,
      required: true,
      trim: true,
    },
    difficulty: {
      type: String,
      required: true,
      enum: ["Beginner", "Moderate", "Expert"],
    },
    images: {
      type: [String],
      default: [],
    },
    join_deadline: {
      type: Date,
      default: null,
    },
    attendees: [
      {
        name: { type: String, required: true, trim: true },
        phone: { type: String, required: true, trim: true },
        email: { type: String, required: true, trim: true, lowercase: true },
        joined_at: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true },
);

EventSchema.index({ start_time: 1 });

// Delete cached model to ensure schema changes (like join_deadline) take effect
if (mongoose.models.Event) {
  delete mongoose.models.Event;
}

const Event = mongoose.model("Event", EventSchema, "events");

export default Event;
