const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  title: { type: String, required: true },
  author: { type: String, required: true },
  description: { type: String },
  totalCopies: { type: Number, required: true, default: 1 },
  availableCopies: { type: Number, required: true, default: 1 }
}, { timestamps: true });

module.exports = mongoose.model("Book", bookSchema);
