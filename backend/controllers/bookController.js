const Book = require("../models/Book");

// @desc Get all books
exports.getAllBooks = async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Add a new book
// controllers/bookController.js


exports.addBook = async (req, res) => {
  try {
    const { title, author, description, availableCopies } = req.body;

    if (!title || !author) {
      return res.status(400).json({ message: "Title and author are required" });
    }

    const book = new Book({
      title,
      author,
      description,
      availableCopies: availableCopies || 1, // default 1 copy
    });

    await book.save();
    res.status(201).json({ message: "Book added successfully", book });
  } catch (err) {
    console.error("Error in addBook:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// @desc Delete a book
exports.deleteBook = async (req, res) => {
  try {
    await Book.findByIdAndDelete(req.params.id);
    res.json({ message: "Book deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// @desc Update a book
exports.updateBook = async (req, res) => {
  try {
    const book = await Book.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }
    
    res.json(book);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
