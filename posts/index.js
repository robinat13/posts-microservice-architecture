const express = require("express");
const app = express();
const { randomBytes } = require("crypto");
const { json } = require("express");
const cors = require("cors");
const axios = require("axios");

app.use(cors());

app.use(json());
const posts = {};
app.get("/posts", async (req, res) => {
  res.status(200).json(posts);
});
app.post("/posts/create", async (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };
  await axios.post("http://event-bus-srv:4005/events", {
    eventType: "PostCreated",
    data: { ...posts[id] },
  });
  res.status(201).json(posts[id]);
});

app.post("/events", (req, res) => {
  console.log(`Received event ${req.body.eventType}`);
  res.status(200);
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
