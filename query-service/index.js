const express = require("express");
const cors = require("cors");
const { json } = require("express");

const app = express();

app.use(json());
app.use(cors());

const posts = {};

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

app.post("/events", (req, res) => {
  const { eventType, data } = req.body;

  if (eventType === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (eventType === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  }
  res.status(200);
});

app.listen(4002, () => {
  console.log("Server started on post 4002");
});
