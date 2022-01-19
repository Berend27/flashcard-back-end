const cors = require("cors");
const cardsRouter = require("./cards/cards.router");
const decksRouter = require("./decks/decks.router");
const express = require("express");
const errorHandler = require("./errors/errorHandler");
const notFound = require("./errors/notFound");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/cards", cardsRouter);
app.use("/decks", decksRouter);

app.use(notFound);
app.use(errorHandler);

module.exports = app;