const mongoose = require("mongoose");

const issueSchema = new mongoose.Schema(
  {
    title: {
       type: String, 
       required: true 
      },
    description: {
       type: String, 
       required: true
       },
    category: {
      type: String,
      enum: ["Road", "Garbage", "Water", "Electricity"],
      required: true,
    },
    imageUrl: { type: String },
    location: {
      latitude: Number,
      longitude: Number,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Resolved"],
      default: "Pending",
    },
    reportedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);
