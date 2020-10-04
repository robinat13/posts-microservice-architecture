const express = require("express");
const app = express();
const { randomBytes } = require("crypto");
const { json } = require("express");

app.use(json());
const posts = {};
app.get("/posts", (req, res) => {
  res.status(200).json(posts);
});
app.post("/posts", (req, res) => {
  const id = randomBytes(4).toString("hex");
  const { title } = req.body;
  posts[id] = { id, title };
  res.status(201).json(posts[id]);
});

app.listen(4000, () => {
  console.log("Server started on port 4000");
});
