const Book = require('../models/Book');

exports.addBook = async (req, res) => {
  const { title, author, ISBN, publicationDate, genre, copies } = req.body;
  try {
    const book = new Book({ title, author, ISBN, publicationDate, genre, copies });
    await book.save();
    res.status(201).json({ message: 'Book added successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateBook = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;
  try {
    await Book.findByIdAndUpdate(id, updates);
    res.status(200).json({ message: 'Book updated successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteBook = async (req, res) => {
  const { id } = req.params;
  try {
    await Book.findByIdAndDelete(id);
    res.status(200).json({ message: 'Book deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.listBooks = async (req, res) => {
  const { genre, author, page = 1, limit = 10 } = req.query;
  const filter = {};
  if (genre) filter.genre = genre;
  if (author) filter.author = author;
  
  try {
    const books = await Book.find(filter)
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json(books);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
