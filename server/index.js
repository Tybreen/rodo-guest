require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const app = express();
const jwt = require("jsonwebtoken");

const PORT = process.env.PORT || 3000;

app.use(morgan(`dev`));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// URL: /

app.use((req, res, next) => {
  const auth = req.headers.authorization;
  const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    req.user = null;
  }

  next();
});

app.use(`/auth`, require(`./api/auth`));

app.use(`/api/v1/robots`, require(`./api/robots`));

app.use((req, res) => res.status(404).send("Not found."));

app.listen(PORT, () => {
  console.log(`Server listening to ${PORT}`);
});

module.exports = app;
