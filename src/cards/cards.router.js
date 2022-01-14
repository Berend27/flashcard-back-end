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
    .delete(controller.delete)
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;