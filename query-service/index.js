const express = require("express");
const cors = require("cors");
const { json } = require("express");
const axios = require("axios");

const app = express();

app.use(json());
app.use(cors());

const posts = {};
const processEvents = (eventType, data) => {
  if (eventType === "PostCreated") {
    const { id, title } = data;
    posts[id] = { id, title, comments: [] };
  } else if (eventType === "CommentCreated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    post.comments.push({ id, content, status });
  } else if (eventType === "CommentUpdated") {
    const { id, content, postId, status } = data;
    const post = posts[postId];
    const comment = post.comments.find((comment) => comment.id === id);
    comment.status = status;
    comment.content = content;
  }
};

app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});

app.post("/events", (req, res) => {
  const { eventType, data } = req.body;
  processEvents(eventType, data);
  res.status(200);
});

app.listen(4002, async () => {
  console.log("Server started on post 4002");
  const res = await axios.get("http://event-bus-srv:4005/events");
  for (let event of res.data) {
    console.log("Processing event", event.eventType);
    processEvents(event.eventType, event.data);
  }
});
