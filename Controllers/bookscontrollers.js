const Book = require("../models/booksModel");
const mongoose = require("mongoose");
const User = require("../models/usersModel");

//GET all books
const getAllBooks = async (req, res) => {
  const { genre, title, status, pages, language, author } = req.query;

  try {
    const query = {};
    if (genre) {
      query.genre = genre;
    }
    if (title) {
      query.title = { $regex: title, $options: "i" };
    }
    if (status) {
      query.status = status;
    }
    if (pages) {
      query.pages = {
        $gte: parseInt(pages) - 100,
        $lte: parseInt(pages) + 100,
      };
    }
    if (language) {
      query.language = { $regex: language, $options: "i" };
    }
    if (author) {
      query.author = { $regex: author, $options: "i" };
    }

    let allbooks = await Book.find(query).sort({ title: 1 });

    if (allbooks.length === 0) {
      return res.status(404).json({ message: "No books match your search" });
    }

    res.status(200).json(allbooks);
  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
};
//GET a single book
const getBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such book" });
  }

  const singleBook = await Book.findById(id);

  if (!singleBook) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json(singleBook);
};

//CREATE a new book
const createBook = async (req, res) => {
  const {
    title,
    author,
    pages,
    genre,
    language,
    firstPublished,
    lifeChanging,
    authorBio,
    status,
    photoURL,
    synopsis,
    characters,
  } = req.body;

  try {
    if (!title) {
      throw Error("Please enter a title");
      return;
    }

    if (!author) {
      throw Error("Please enter an author");
      return;
    }

    if (!genre) {
      throw Error("Please enter a genre");
      return;
    }

    if (!status) {
      throw Error("Please enter a status");
      return;
    }

    if (req.file) {
      // Image is uploaded, add image URL to body
      createdBook = await Book.create({
        ...req.body,
        photoURL: req.file.path,
      });
    } else {
      // No image uploaded, create book with default image URL
      createdBook = await Book.create({
        ...req.body,
        photoURL:
          "https://res.cloudinary.com/dc2qd4mzh/image/upload/v1684320349/J5LVHEL_erswxp.jpg",
      });
    }

    res.status(201).json(createdBook);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//DELETE a book

const deleteBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such book" });
  }

  const deletedBook = await Book.findOneAndDelete({ _id: id });

  if (!deletedBook) {
    return res.status(404).json({ error: "Book not found" });
  }

  res.status(200).json(deletedBook);
};

//UPDATE a book

const updateBook = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such book" });
  }

  if (req.file) {
    // Image is uploaded, add image URL to body
    updatedbook = await Book.findOneAndUpdate(
      { _id: id },
      { ...req.body, photoURL: req.file.path },
      { new: true }
    );
  } else {
    // No image uploaded
    updatedbook = await Book.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );
  }

  if (!updatedbook) {
    return res.status(404).json({ error: "Book not found" });
  }

  try {
    res.status(200).json(updatedbook);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBook,
  deleteBook,
  updateBook,
};
