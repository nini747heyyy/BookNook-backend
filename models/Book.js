const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true,
      maxlength: 100
    },
    author: {
      type: String,
      required: [true, "Author is required"],
      trim: true,
      maxlength: 100
    },
    genre: {
      type: String,
      required: [true, "Genre is required"],
      trim: true
    },
    rating: {
      type: Number,
      min: [1, "Rating must be between 1 and 5"],
      max: [5, "Rating must be between 1 and 5"],
      default: null
    },
    status: {
      type: String,
      enum: {
        values: ["Read", "Unread"],
        message: "Status must be either 'Read' or 'Unread'"
      },
      default: "Unread"
    },
    description: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500
    }
  },
  {
    timestamps: true
  }
);

const Book = mongoose.model("Book", bookSchema);
module.exports = Book;