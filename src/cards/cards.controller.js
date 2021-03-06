const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const cardsService = require("./cards.service");
const decksService = require("../decks/decks.service");

const REQUIRED_PROPERTIES = [
    'front',
    'back',
    'deckId'
];

const VALID_PROPERTIES = [
    ...REQUIRED_PROPERTIES,
    'id',
    'created_at',
    'updated_at'
];

const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES);

async function cardExists(req, res, next) {
    const cardId = req.params.cardId;
    const card = await cardsService.read(cardId);
    if (card) {
        res.locals.card = card;
        return next();
    }
    next({ status: 404, message: `Card with id ${cardId} not found` });
}

async function cardHasValidDeckId(req, res, next) {
    const deckId = req.body.data.deckId;
    const deck = await decksService.read(deckId);
    if (deck) {
        return next();
    }
    next({ status: 404, message: `Deck not found for this card` });
}

async function deckExists(req, res, next) {
    const deckId = req.query.deckId;
    if (!deckId) {
        return next({ 
            status: 404, 
            message: `A positive deckId value is needed in the query to list all the cards in a deck.` 
        });
    }
    const deck = await decksService.read(deckId);
    if (deck) {
        res.locals.deck = deck;
        return next();
    }
    next({ status: 404, message: `Deck with id ${deckId} not found` });
}

function hasOnlyValidProperties(req, res, next) {
    const { data = {} } = req.body;
  
    const invalidFields = Object.keys(data).filter(
      (field) => !VALID_PROPERTIES.includes(field)
    );
  
    if (invalidFields.length) {
      return next({
        status: 400,
        message: `Invalid field(s): ${invalidFields.join(", ")}`,
      });
    }
    next();
}

function idNotManuallySet(req, res, next) {
    const { data = {} } = req.body;
    if ('id' in data) {
        return next({
            status: 400,
            message: `Do not manually set the id for a card.`,
        });
    }
    next();
}

// Route Handlers

async function create(req, res) {
    const data = await cardsService.create(req.body.data);
    res.status(201).json({ data });
}

async function destroy(req, res) {
    const id = res.locals.card.id;
    await cardsService.destroy(id);
    res.sendStatus(204);
}

async function listCardsForDeck(req, res) {
    const data = await cardsService.listForDeck(res.locals.deck.id);
    res.json({ data });
}

function read(req, res) {
    res.json({ data: res.locals.card });
}

async function update(req, res) {
    const updatedCard = {
        ...res.locals.card,
        ...req.body.data,
        id: res.locals.card.id,
    };
    const data = await cardsService.update(updatedCard);
    res.status(200).json({ data });
}

module.exports = {
    create: [
        hasOnlyValidProperties,
        hasRequiredProperties,
        idNotManuallySet,
        asyncErrorBoundary(cardHasValidDeckId),
        asyncErrorBoundary(create)
    ],
    delete: [
        asyncErrorBoundary(cardExists),
        asyncErrorBoundary(destroy)
    ],
    listCardsForDeck: [
        asyncErrorBoundary(deckExists),
        asyncErrorBoundary(listCardsForDeck)
    ],
    read: [
        asyncErrorBoundary(cardExists),
        read
    ],
    update: [
        asyncErrorBoundary(cardExists),
        hasOnlyValidProperties,
        update
    ]
}