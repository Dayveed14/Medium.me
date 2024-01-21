const express = require("express");
const User = require("../model/User.model");
const router = express.Router();
const multer = require("multer");
const path = require("path");

// Set up Multer for handling file uploads
const storage = multer.diskStorage({
  destination: "./uploads/", // Set your desired destination for storing images
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

// register
router.post("/register", upload.single("image"), async (req, res) => {
  try {
    const checkIfUserExists = await User.findOne({ email: req.body.email });
    if (checkIfUserExists) {
      res.send({
        status: 404,
        message: "Email Already Exists",
      });
    } else {
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        summary: req.body.summary,
        role: "user",
        image: "/uploads/" + req.file.filename, // Set the image field with the file path or URL
      });

      const result = await user.save();
      res.send({
        status: 200,
        message: "User created successfully",
        data: result,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error saving user with image" });
  }
});

// create a user
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const checkIfUserExists = await User.findOne({ email: req.body.email });
    if (checkIfUserExists) {
      res.send({
        status: 404,
        message: "Email Already Exists",
      });
    } else {
      const user = new User({
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        role: req.body.role,
        role: req.body.summary,
        image: "/uploads/" + req.file.filename, // Set the image field with the file path or URL
      });

      const result = await user.save();
      res.send({
        status: 200,
        message: "User created successfully",
        data: result,
      });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Error saving user with image" });
  }
});

// Get a single user by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await User.findById(req.params.id);
    if (!result) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).send({
        message: "OK",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching user" });
  }
});

// Delete a user by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message: "User not found" });
    } else {
      res.status(200).send({
        message: "User deleted successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting user" });
  }
});

// Get all users
router.get("/", async (req, res, next) => {
  try {
    const result = await User.find();
    res.send({
      status: 200,
      message: "OK",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
});

// Login route
router.post("/login", async (req, res, next) => {
  try {
    const checkIfUserExists = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });
    if (!checkIfUserExists) {
      res.send({
        status: 404,
        message: "User does not exist",
      });
    } else {
      res.send({
        status: 200,
        message: "Login Successful",
        data: checkIfUserExists,
      });
    }
  } catch (error) {
    console.log(error);
  }
});

// Edit user route
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    existingUser.first_name = req.body.first_name || existingUser.first_name;
    existingUser.last_name = req.body.last_name || existingUser.last_name;
    existingUser.email = req.body.email || existingUser.email;
    existingUser.password = req.body.password || existingUser.password;
    existingUser.summary = req.body.summary || existingUser.summary;
    existingUser.role = req.body.role || existingUser.role;

    if (req.file) {
      existingUser.image = "/uploads/" + req.file.filename;
    }
    const updatedUser = await existingUser.save();

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// Edit Profile route
router.put("/editprofile/:id", upload.single("image"), async (req, res) => {
  try {
    const userId = req.params.id;
    const existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    existingUser.first_name = req.body.first_name || existingUser.first_name;
    existingUser.last_name = req.body.last_name || existingUser.last_name;
    existingUser.email = req.body.email || existingUser.email;
    existingUser.password = req.body.password || existingUser.password;
    existingUser.summary = req.body.summary || existingUser.summary;

    if (req.file) {
      existingUser.image = "/uploads/" + req.file.filename;
    }
    const updatedUser = await existingUser.save();

    res.status(200).json({
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating user" });
  }
});

// Admin Login route
router.post("/adminlogin", async (req, res, next) => {
  try {
    const checkIfUserExists = await User.findOne({
      email: req.body.email,
      password: req.body.password,
    });

    if (!checkIfUserExists) {
      res.send({
        status: 404,
        message: "User does not exist",
      });
    } else {
      if (checkIfUserExists.role === "admin") {
        res.send({
          status: 200,
          message: "Login Successful",
          data: checkIfUserExists,
        });
      } else {
        res.send({
          status: 403,
          message: "Access forbidden. User is not an admin.",
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      message: "Internal Server Error",
    });
  }
});

module.exports = router;
