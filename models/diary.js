const mongoose = require("mongoose");

const DiarySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  body: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "public",
    enum: ["public", "private"], // Corrected typo "priate" to "private"
  },
  user: {
    type: mongoose.Schema.Types.ObjectId, // Corrected property name "objectId" to "ObjectId"
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Diary", DiarySchema);
