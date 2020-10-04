const express = require("express");
const app = express();
const { randomBytes } = require("crypto");
const { json } = require("express");

app.use(json());
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.status(201).json(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { content } = req.body;
  //   if (commentsByPostId[req.params.id]) {
  //     commentsByPostId[req.params.id].push({ id, content });
  //   } else {
  //     commentsByPostId[req.params.id] = [{ id, content }];
  //   }
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id, content });
  commentsByPostId[req.params.id] = comments;
  res.status(201).json(comments);
});

app.listen(4001, () => {
  console.log("Server started on port 4001");
});
