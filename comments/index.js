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
  comments.push({ id, content, status: "pending" });
  commentsByPostId[req.params.id] = comments;
  await axios.post("http://localhost:4005/events", {
    eventType: "CommentCreated",
    data: {
      id,
      content,
      status: "pending",
      postId: req.params.id,
    },
  });
  res.status(201).json(comments);
});

app.post("/events", async (req, res) => {
  console.log(`Received event ${req.body.eventType}`);
  const { eventType, data } = req.body;
  if (eventType === "CommentModerated") {
    const { postId, id, status, content } = data;
    const comments = commentsByPostId[postId];
    const comment = comments.find((comment) => comment.id === id);
    comment.status = status;
    await axios.post("http://localhost:4005/events", {
      eventType: "CommentUpdated",
      data: {
        id,
        status,
        postId,
        content,
      },
    });
  }
  res.status(200);
});

app.listen(4001, () => {
  console.log("Server started on port 4001");
});
