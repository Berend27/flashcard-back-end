const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const decksService = require("./decks.service");

async function deckExists(req, res, next) {
    const deck = await decksService.read(req.params.deckId);
    if (deck) {
        res.locals.deck = deck;
        return next();
    }
    next({ status: 404, message: `Deck with id ${deckId} not found` });
}

async function list(req, res) {
    const data = await decksService.list();
    res.json({ data });
}

function read(req, res) {
    res.json({ data: res.locals.deck });
}

module.exports = {
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(deckExists), read],
};