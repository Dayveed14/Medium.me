const express = require("express");
const Comment = require("../model/Comment.model");
const router = express.Router();

//create  acomment
router.post("/", async (req, res) => {
  try {
    const comment = new Comment({
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      body: req.body.body,
      title: req.body.title,
      clap: 0,
      unclap: 0,
    });

    const result = await comment.save();
    res.send({
      status: 200,
      message: "Comment created successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error saving Comment" });
  }
});

// Get a single Comment by ID
router.get("/:id", async (req, res) => {
  try {
    const result = await Comment.findById(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Comment not found" });
    } else {
      res.status(200).send({
        message: "OK",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error fetching Comment" });
  }
});

// Delete a Comment by ID
router.delete("/:id", async (req, res) => {
  try {
    const result = await Comment.findByIdAndDelete(req.params.id);
    if (!result) {
      res.status(404).json({ message: "Comment not found" });
    } else {
      res.status(200).send({
        message: "Comment deleted successfully",
        data: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error deleting Comment" });
  }
});

// Get all Comments
router.get("/", async (req, res, next) => {
  try {
    const result = await Comment.find();
    res.send({
      status: 200,
      message: "OK",
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
});

// Edit Comment route
router.put("/:id", async (req, res) => {
  try {
    const commentId = req.params.id;

    // Check if the Comment exists
    const existingComment = await Comment.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: "Post not found" });
    }
    existingComment.first_name =
      req.body.first_name || existingComment.first_name;
    existingComment.last_name = req.body.last_name || existingComment.last_name;
    existingComment.body = req.body.body || existingComment.body;
    existingComment.clap = req.body.clap || existingComment.clap;
    existingComment.unclap = req.body.unclap || existingComment.unclap;

    // Save the updated post
    const updatedComment = await existingComment.save();

    res.status(200).json({
      message: "Comment updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating Comment" });
  }
});

//edit comment clap
router.put("/:commentId", async (req, res) => {
  try {
    const commentId = req.params.id;
    const existingComment = await Post.findById(commentId);
    if (!existingComment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    existingComment.clap + 1;
    const updatedComment = await existingComment.save();
    res.status(200).json({
      message: "Comment claps updated successfully",
      data: updatedComment,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error updating comment claps" });
  }
});
module.exports = router;
