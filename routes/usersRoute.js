const express = require("express");

const {
  loginUser,
  signUpUser,
  getAllUsers,
  getUser,
  updateUser,
  updateAdminStatus,
  updateUserSavedBooks,
} = require("../Controllers/userscontrollers");
const router = express.Router();
const requireAuth = require("../middleware/requireauth");
const { uploadImage } = require("../middleware/uploadmiddleware");
const { encryptPassword } = require("../middleware/updatemiddleware");
const { checkPassword, checkUser } = require("../middleware/loginmiddleware");

//login route
router.post("/login", checkUser, checkPassword, loginUser);

//signup route
router.post("/signup", signUpUser);

// GET ALL
router.get("/", requireAuth, getAllUsers);

// GET ONE
router.get("/:id", getUser);

// UPDATE
router.patch(
  "/:id",
  requireAuth,
  encryptPassword,
  uploadImage.single("profilePicture"),
  updateUser
);

//UPDATE SAVED BOOKS
router.put( "/:id/save", requireAuth,  updateUserSavedBooks)

// Update user's admin status
router.put("/:id/admin", requireAuth, updateAdminStatus);

module.exports = router;
