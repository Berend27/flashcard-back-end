const controller = require("./decks.controller");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/")
    .get(controller.list)
    .all(methodNotAllowed);

router
    .route("/:deckId")
    .get(controller.read)
    .all(methodNotAllowed);

module.exports = router;