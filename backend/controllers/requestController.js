const Request = require("../models/Request");
const Book = require("../models/Book");
const Issue = require("../models/Issue");

// Create a new book request (student)
exports.requestBook = async (req, res) => {
  try {
    const { bookId } = req.params;
    const userId = req.user.id;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    // Check availability
    if (book.availableCopies <= 0) {
      return res.status(400).json({ message: "Book is not available right now" });
    }

    const existingRequest = await Request.findOne({ user: userId, book: bookId, status: "pending" });
    if (existingRequest)
      return res.status(400).json({ message: "You already have a pending request for this book" });

    const existingIssue = await Issue.findOne({ user: userId, book: bookId, isReturned: false });
    if (existingIssue)
      return res.status(400).json({ message: "You have already borrowed this book" });

    const request = new Request({
      user: userId,
      book: bookId,
      requestDate: new Date()
    });

    await request.save();

    res.status(201).json({
      success: true,
      message: "Book request submitted successfully",
      request
    });
  } catch (err) {
    console.error("Error in requestBook:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get all requests (admin only)
exports.getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find()
      .populate("book")
      .populate("user", "name email");
    res.json(requests);
  } catch (err) {
    console.error("Error in getAllRequests:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Get user's requests
exports.getUserRequests = async (req, res) => {
  try {
    const requests = await Request.find({ user: req.user.id })
      .populate("book")
      .sort({ requestDate: -1 });
    res.json(requests);
  } catch (err) {
    console.error("Error in getUserRequests:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Approve a request (admin)
exports.approveRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ message: `Request is already ${request.status}` });

    const book = await Book.findById(request.book);
    if (!book) return res.status(404).json({ message: "Book not found" });

    if (book.availableCopies <= 0)
      return res.status(400).json({ message: "No available copies left" });

    // Update request
    request.status = "approved";
    request.responseDate = new Date();
    await request.save();

    // Create issue record
    const issue = new Issue({
      user: request.user,
      book: request.book,
      issueDate: new Date()
    });
    await issue.save();

    // Decrease available copies
    book.availableCopies -= 1;
    await book.save();

    res.json({
      success: true,
      message: "Request approved and book issued successfully",
      request
    });
  } catch (err) {
    console.error("Error in approveRequest:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Reject a request (admin)
exports.rejectRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const { message } = req.body;

    const request = await Request.findById(requestId);
    if (!request) return res.status(404).json({ message: "Request not found" });

    if (request.status !== "pending")
      return res.status(400).json({ message: `Request is already ${request.status}` });

    request.status = "rejected";
    request.responseDate = new Date();
    request.responseMessage = message;
    await request.save();

    res.json({
      success: true,
      message: "Request rejected successfully",
      request
    });
  } catch (err) {
    console.error("Error in rejectRequest:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};
