const User = require("../models/usersModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

//login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);

    //create a token
    const token = createToken(user._id);

    res.status(200).json({ _id: user._id, email, token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup a user
const signUpUser = async function (req, res) {
  const { email, password, firstName, lastName, phoneNum } = req.body;

  try {
    const user = await User.signup(
      email,
      password,
      firstName,
      lastName,
      phoneNum
    );

    //create a token
    const token = createToken(user._id);

    res
      .status(200)
      .json({ _id: user._id, email, firstName, lastName, token, phoneNum });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

//GET all Users
const getAllUsers = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.status(200).json(allUsers);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};
//GET a single User
const getUser = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such User" });
  }

  const singleUser = await User.findById(id).populate("saved").populate({
    path: "myBooks.bookId",
    model: "Book",
  });

  if (!singleUser) {
    return res.status(404).json({ error: "User not found" });
  }

  res.status(200).json(singleUser);
};

//UPDATE a USER

const updateUser = async (req, res) => {
  let updatedUser;
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such user" });
    }
    if (req.file) {
      updatedUser = await User.findByIdAndUpdate(
        id, // Updated to use the `id` directly as the query condition
        {
          $set: {
            saved: req.body.saved,
            profilePicture: req.file.path,
            ...req.body,
          },
        },
        { new: true }
      );
    } else {
      updatedUser = await User.findByIdAndUpdate(
        id, // Updated to use the `id` directly as the query condition
        { $set: { saved: req.body.saved, ...req.body } },
        { new: true }
      );
    }

    // Erase book from user on return
    if (req.body.itemToDelete) {
      updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $pull: { myBooks: { bookId: req.body.itemToDelete } } },
        { new: true }
      );
    }

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

//UPDATE a USER (SAVED Books)
const updateUserSavedBooks = async (req, res) => {
  const { id } = req.params;

  try {
    let updatedUser;
    // remove save book from user on return
    if (req.body.savedItemToDelete) {
      updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $pull: { saved: req.body.savedItemToDelete } },
        { new: true }
      );
    } else {
      updatedUser = await User.findOneAndUpdate(
        { _id: id },
        { $push: { saved: req.body.savedItemToAdd } },
        { new: true }
      );
    }
    res.status(200).json(updatedUser);
  } catch (err) {
    console.log(err);
    res.status(500).send(err);
  }
};

// Update user's admin status
const updateAdminStatus = async (req, res) => {
  const { id } = req.params;
  const { isAdmin } = req.body;

  try {
    // Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Update the isAdmin field
    user.isAdmin = isAdmin;
    await user.save();

    res.status(200).json({ message: "User admin status updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  loginUser,
  signUpUser,
  getUser,
  getAllUsers,
  updateUser,
  updateAdminStatus,
  updateUserSavedBooks,
};
