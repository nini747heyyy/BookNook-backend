const Book = require("../models/Book");

// GET /api/books
const getBooks = async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { author: { $regex: search, $options: "i" } }
        ]
      };
    }

    const books = await Book.find(query).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST /api/books
const createBook = async (req, res) => {
  try {
    const { title, author, genre, rating, status, description } = req.body;

    // Validation
    if (!title || !author || !genre) {
      return res.status(400).json({
        message: "Title, Author, and Genre are required fields"
      });
    }

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    if (status && !["Read", "Unread"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'Read' or 'Unread'"
      });
    }

    const book = await Book.create({
      title,
      author,
      genre,
      rating: rating || null,
      status: status || "Unread",
      description: description || ""
    });

    res.status(201).json(book);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(400).json({ message: error.message });
  }
};

// PUT /api/books/:id
const updateBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    const { title, author, genre, rating, status, description } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    if (status && !["Read", "Unread"].includes(status)) {
      return res.status(400).json({
        message: "Status must be either 'Read' or 'Unread'"
      });
    }

    if (title !== undefined) book.title = title;
    if (author !== undefined) book.author = author;
    if (genre !== undefined) book.genre = genre;
    if (rating !== undefined) book.rating = rating;
    if (status !== undefined) book.status = status;
    if (description !== undefined) book.description = description;

    const updatedBook = await book.save();
    res.json(updatedBook);
  } catch (error) {
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    res.status(400).json({ message: error.message });
  }
};

// DELETE /api/books/:id
const deleteBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndDelete(req.params.id);

    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    res.json({ message: "Book deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✅ Make sure this exports all functions
module.exports = { getBooks, createBook, updateBook, deleteBook };