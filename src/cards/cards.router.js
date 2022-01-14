const controller = require("./cards.controller");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/")
    .get(controller.listCardsForDeck)
    .post(controller.create)
    .all(methodNotAllowed);

router
    .route("/:cardId")
    .get(controller.read)
    .all(methodNotAllowed);

module.exports = router;