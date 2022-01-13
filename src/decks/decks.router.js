const controller = require("./decks.controller");
const router = require("express").Router();
const methodNotAllowed = require("../errors/methodNotAllowed");

router
    .route("/")
    .get(controller.list)
    .post(controller.create)
    .all(methodNotAllowed);

router
    .route("/:deckId")
    .delete(controller.delete)
    .get(controller.read)
    .put(controller.update)
    .all(methodNotAllowed);

module.exports = router;