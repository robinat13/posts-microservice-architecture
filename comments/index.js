const express = require("express");
const app = express();
const { randomBytes } = require("crypto");
const { json } = require("express");
const cors = require("cors");
const axios = require("axios");

app.use(cors());

app.use(json());
const commentsByPostId = {};

app.get("/posts/:id/comments", (req, res) => {
  res.status(201).json(commentsByPostId[req.params.id] || []);
});

app.post("/posts/:id/comments", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { content } = req.body;
  const comments = commentsByPostId[req.params.id] || [];
  comments.push({ id, content });
  commentsByPostId[req.params.id] = comments;
  await axios.post("http://localhost:4005/events", {
    eventType: "CommentCreated",
    data: {
      id,
      content,
      postId: req.params.id,
    },
  });
  res.status(201).json(comments);
});

app.post("/events", (req, res) => {
  console.log(`Received event ${req.body.eventType}`);
  res.status(200);
});

app.listen(4001, () => {
  console.log("Server started on port 4001");
});
