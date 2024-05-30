const Borrow = require('../models/Borrow');
const Book = require('../models/Book');

exports.borrowBook = async (req, res) => {
  const { userId, bookId } = req.body;
  try {
    const book = await Book.findById(bookId);
    if (!book || book.copies < 1) {
      return res.status(400).json({ error: 'Book not available' });
    }
    book.copies -= 1;
    await book.save();

    const borrow = new Borrow({ user: userId, book: bookId });
    await borrow.save();
    res.status(201).json({ message: 'Book borrowed successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.returnBook = async (req, res) => {
  const { borrowId } = req.body;
  try {
    const borrow = await Borrow.findById(borrowId).populate('book');
    if (!borrow) {
      return res.status(400).json({ error: 'Borrow record not found' });
    }
    borrow.returnDate = new Date();
    await borrow.save();

    borrow.book.copies += 1;
    await borrow.book.save();

    res.status(200).json({ message: 'Book returned successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.borrowHistory = async (req, res) => {
  const { userId } = req.params;
  try {
    const history = await Borrow.find({ user: userId }).populate('book');
    res.status(200).json(history);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
