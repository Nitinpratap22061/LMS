const Issue = require("../models/Issue");
const Book = require("../models/Book");

exports.returnBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const issue = await Issue.findOne({ user: userId, book: bookId, isReturned: false });
    if (!issue) return res.status(404).json({ message: "No active issue found for this book" });

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
