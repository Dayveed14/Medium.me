const express = require("express");
const path = require("path");
const cors = require("cors");
const mongoose = require("mongoose");
const userApi = require("./routes/User.route");
const commentApi = require("./routes/Comment.route");
const postApi = require("./routes/Post.route");
const PORT = 4000;
const app = express();

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose
  .connect(
    "mongodb+srv://Dayveed:Upt0wnk!nq@cluster0.pzicq0x.mongodb.net/blog_database"
  )
  .then(() => {
    console.log("Connection successful");
  })
  .catch((err) => console.log(err));

app.use("/api/users", userApi);
app.use("/api/posts", postApi);
app.use("/api/comments", commentApi);

app.listen(PORT, () => {
  console.log(`Server running on Port: ${PORT}`);
});
