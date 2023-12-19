const express = require("express");
const Post = require("../model/Post.model");
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

// Admin create a Post
router.post(
  "/add",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const checkIfPostExists = await Post.findOne({ title: req.body.title });
      if (checkIfPostExists) {
        res.send({
          status: 404,
          message: "Post with Similar Title Already Exists",
        });
      } else {
        const post = new Post({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          title: req.body.title,
          body: req.body.body,
          clap: 0,
          unclap: 0,
          category: req.body.category,
          comment: 0,
          author_img:
            "/uploads/" +
            (req.files["image"][1] ? req.files["image"][1].filename : ""),
          image:
            "/uploads/" +
            (req.files["image"][0] ? req.files["image"][0].filename : ""),
        });

        const result = await post.save();
        res.send({
          status: 200,
          message: "Post created successfully",
          data: result,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error saving Post with images" });
    }
  }
);
// User create a Post
router.post(
  "/",
  upload.fields([{ name: "image", maxCount: 1 }]),
  async (req, res) => {
    try {
      const checkIfPostExists = await Post.findOne({ title: req.body.title });
      if (checkIfPostExists) {
        res.send({
          status: 404,
          message: "Post Already Exists",
        });
      } else {
        const post = new Post({
          first_name: req.body.first_name,
          last_name: req.body.last_name,
          title: req.body.title,
          body: req.body.body,
          clap: 0,
          unclap: 0,
          category: req.body.category,
          comment: 0,
          author_img:
            "/uploads/" +
            (req.files["image"][1] ? req.files["image"][1].filename : ""),
          image:
            "/uploads/" +
            (req.files["image"][0] ? req.files["image"][0].filename : ""),
        });

        const result = await post.save();
        res.send({
          status: 200,
          message: "Post created successfully",
          data: result,
        });
      }
    } catch (error) {
      console.error(error);
      res
        .status(500)
        .json({ success: false, message: "Error saving Post with images" });
    }
  }
);

// Get a single Post by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await Post.findById(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).send({
        message: "OK",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching Post" });
  }
});

// Delete a Post by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await Post.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Post not found" });
    } else {
      res.status(200).send({
        message: "Post deleted successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting Post" });
  }
});

// Get all Post
router.get("/", async (req, res, next) => {
  try {
    const result = await Post.find();
    res.send({
      status: 200,
      message: "OK",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
});

// Edit post route
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const postId = req.params.id;

    // Check if the post exists
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Update post information
    existingPost.first_name = req.body.first_name || existingPost.first_name;
    existingPost.last_name = req.body.last_name || existingPost.last_name;
    existingPost.title = req.body.title || existingPost.title;
    existingPost.body = req.body.body || existingPost.body;
    existingPost.category = req.body.category || existingPost.category;
    existingPost.clap = req.body.clap || existingPost.clap;
    existingPost.unclap = req.body.unclap || existingPost.unclap;
    existingPost.comment = req.body.unclap || existingPost.comment;
    existingPost.author_img = existingPost.author_img;
    // If an image is provided, update the image field
    if (req.file) {
      existingPost.image = "/uploads/" + req.file.filename;
    } else {
      existingPost.image = existingPost.image;
    }

    const updatedPost = await existingPost.save();

    res.status(200).json({
      message: "Post updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating postt" });
  }
});

// Edit post clap route
router.put("/:postId", async (req, res) => {
  try {
    const postId = req.params.id;
    const existingPost = await Post.findById(postId);
    if (!existingPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    existingPost.clap + 1;
    const updatedPost = await existingPost.save();
    res.status(200).json({
      message: "Post claps updated successfully",
      data: updatedPost,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating post claps" });
  }
});

module.exports = router;
