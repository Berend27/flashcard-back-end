const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const cardsService = require("./cards.service");
const decksService = require("../decks/decks.service");

async function deckExists(req, res, next) {
    const deck = await decksService.read(req.query.deckId);
    if (deck) {
        res.locals.deck = deck;
        return next();
    }
    next({ status: 404, message: `Deck with id ${deckId} not found` });
}

async function listCardsForDeck(req, res) {
    const data = await cardsService.listForDeck(res.locals.deck.id);
    res.json({ data });
}

module.exports = {
    listCardsForDeck: [
        asyncErrorBoundary(deckExists),
        asyncErrorBoundary(listCardsForDeck)
    ],
}