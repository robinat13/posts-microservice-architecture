const axios = require("axios");
const { json } = require("express");
const express = require("express");
const app = express();

app.use(json());

const events = [];

app.post("/events", (req, res) => {
  const event = req.body;

  events.push(event);
  console.log(`Received event : ${event.eventType}`);

  axios.post("http://posts-srv:4000/events", event);
  axios.post("http://comments-srv:4001/events", event);
  axios.post("http://query-service-srv:4002/events", event);
  axios.post("http://moderation-srv:4003/events", event);

  res.send({ status: "ok" });
});

app.get("/events", (req, res) => {
  res.status(200).json(events);
});

app.listen(4005, () => {
  console.log("Server started on port 4005");
});
