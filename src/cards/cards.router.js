const controller = require("./cards.controller");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/")
    .get(controller.listCardsForDeck)
    .all(methodNotAllowed);

module.exports = router;