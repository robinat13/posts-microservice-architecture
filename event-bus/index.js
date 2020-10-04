const axios = require("axios");
const { json } = require("express");
const express = require("express");
const app = express();

app.use(json());

app.post("/events", (req, res) => {
  const event = req.body;

  axios.post("http://localhost:4000/events", event);
  axios.post("http://localhost:4001/events", event);
  axios.post("http://localhost:4002/events", event);
  axios.post("http://localhost:4003/events", event);

  res.send({ status: "ok" });
});

app.listen(4005, () => {
  console.log("Server started on port 4005");
});
