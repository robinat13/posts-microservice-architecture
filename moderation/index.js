const express = require("express");
const axios = require("axios");
const { json } = require("express");

const app = express();

app.use(json());

app.post("/events", async (req, res) => {
  const { eventType, data } = req.body;

  if (eventType === "CommentCreated") {
    const status = data.content.includes("orange") ? "rejected" : "approved";
    await axios.post("http://localhost:4005/events", {
      eventType: "CommentModerated",
      data: {
        id: data.id,
        postId: data.postId,
        status,
        content: data.content,
      },
    });
  }
  res.sendStatus(200);
});

app.listen(4003, () => {
  console.log("Moderation server started on port 4003");
});
