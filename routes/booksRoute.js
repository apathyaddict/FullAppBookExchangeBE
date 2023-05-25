  const express = require("express");
  const {
    createBook,
    getBook,
    getAllBooks,
    deleteBook,
    updateBook
  } = require('../Controllers/bookscontrollers');
  const requireAuth = require('../middleware/requireauth')
  const {uploadImage} = require('../middleware/uploadmiddleware')
  const router = express.Router();



  // CREATE
  router.post("/", requireAuth, uploadImage.single('photoURL'), createBook);

  // GET ALL
  router.get("/", getAllBooks);

  // READ
  router.get("/:id", getBook);

  // UPDATE
  router.patch("/:id", requireAuth, uploadImage.single('photoURL'), updateBook);

  // DELETE
  router.delete("/:id", requireAuth, deleteBook);

  module.exports = router;
