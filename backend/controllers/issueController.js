const Issue = require("../models/Issue");
const Book = require("../models/Book");

// =============================
// Issue a book
// =============================
exports.issueBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "No copies available" });
    }

    // Check if user already has this book issued
    const alreadyIssued = await Issue.findOne({
      user: userId,
      book: bookId,
      isReturned: false,
    });

    if (alreadyIssued) {
      return res.status(400).json({ message: "You already issued this book" });
    }

    // Create issue record
    const newIssue = new Issue({
      user: userId,
      book: bookId,
      issueDate: new Date(),
      isReturned: false,
    });

    await newIssue.save();

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    res.status(200).json({
      success: true,
      message: "Book issued successfully",
      issue: newIssue,
    });
  } catch (err) {
    console.error("Error in issueBook:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =============================
// Return a book
// =============================
exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const issue = await Issue.findOne({
      user: userId,
      book: bookId,
      isReturned: false,
    });

    if (!issue)
      return res
        .status(404)
        .json({ message: "No active issue found for this book" });

    issue.isReturned = true;
    issue.returnDate = new Date();
    await issue.save();

    const book = await Book.findById(bookId);
    if (book) {
      book.availableCopies += 1;
      await book.save();
    }

    res.json({ success: true, message: "Book returned successfully" });
  } catch (err) {
    console.error("Error in returnBook:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =============================
// Get all issues for logged-in user
// =============================
exports.getUserIssues = async (req, res) => {
  try {
    const userId = req.user.id;
    const issues = await Issue.find({ user: userId }).populate("book", "title author");
    res.status(200).json(issues);
  } catch (err) {
    console.error("Error in getUserIssues:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// =============================
// Admin: Get all issues
// =============================
exports.getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("user", "name email")
      .populate("book", "title author");
    res.status(200).json(issues);
  } catch (err) {
    console.error("Error in getAllIssues:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
