const User = require('../models/User');
const Book = require('../models/Book');
const Borrow = require('../models/Borrow');
const { generateToken } = require('../utils/jwtUtils');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const resolvers = {
  Query: {
    users: async () => await User.find(),
    books: async (_, { genre, author, page = 1, limit = 10 }) => {
      const filter = {};
      if (genre) filter.genre = genre;
      if (author) filter.author = author;
      return await Book.find(filter)
        .skip((page - 1) * limit)
        .limit(Number(limit));
    },
    borrowHistory: async (_, { userId }) => await Borrow.find({ user: userId }).populate('book'),
  },
  Mutation: {
    register: async (_, { name, email, password }) => {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      return "User registered successfully";
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });
      if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Invalid credentials');
      }
      return generateToken(user._id, user.role);
    },
    addBook: async (_, { title, author, ISBN, publicationDate, genre, copies }) => {
      const book = new Book({ title, author, ISBN, publicationDate, genre, copies });
      await book.save();
      return book;
    },
    updateBook: async (_, { id, ...updates }) => await Book.findByIdAndUpdate(id, updates, { new: true }),
    deleteBook: async (_, { id }) => {
      await Book.findByIdAndDelete(id);
      return "Book deleted successfully";
    },
    borrowBook: async (_, { userId, bookId }) => {
      const book = await Book.findById(bookId);
      if (!book || book.copies < 1) {
        throw new Error('Book not available');
      }
      book.copies -= 1;
      await book.save();
      const borrow = new Borrow({ user: userId, book: bookId });
      await borrow.save();
      return borrow;
    },
    returnBook: async (_, { borrowId }) => {
      const borrow = await Borrow.findById(borrowId).populate('book');
      if (!borrow) {
        throw new Error('Borrow record not found');
      }
      borrow.returnDate = new Date();
      await borrow.save();
      borrow.book.copies += 1;
      await borrow.book.save();
      return borrow;
    },
  },
};

module.exports = resolvers;
