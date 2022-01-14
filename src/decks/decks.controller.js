const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const hasProperties = require("../errors/hasProperties");
const decksService = require("./decks.service");

// todo: REQUIRED PROPERTIES AND VALID_PROPERTIES

const REQUIRED_PROPERTIES = [
    'name'
]

const VALID_PROPERTIES = [
    ...REQUIRED_PROPERTIES,
    'id',
    'description',
    'created_at',
    'updated_at'
]

const hasRequiredProperties = hasProperties(...REQUIRED_PROPERTIES);

async function deckExists(req, res, next) {
    const deck = await decksService.read(req.params.deckId);
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
            message: `Do not manually set the id for a deck.`,
        });
    }
    next();
}

// Route Handlers

async function create(req, res) {
    const data = await decksService.create(req.body.data);
    res.status(201).json({ data });
}

async function destroy(req, res) {
    const { deck } = res.locals;
    await decksService.destroy(deck.id);
    res.sendStatus(204);
}

async function list(req, res) {
    const data = await decksService.list();
    res.json({ data });
}

function read(req, res) {
    res.json({ data: res.locals.deck });
}

async function update(req, res) {
    const updatedDeck = {
        ...res.locals.deck,
        ...req.body.data,
        id: res.locals.deck.id,
    };
    const data = await decksService.update(updatedDeck);
    res.status(200).json({ data });
}

module.exports = {
    create: [
        hasOnlyValidProperties,
        idNotManuallySet,
        hasRequiredProperties,
        asyncErrorBoundary(create)
    ],
    delete: [
        asyncErrorBoundary(deckExists),
        asyncErrorBoundary(destroy)
    ],
    list: asyncErrorBoundary(list),
    read: [asyncErrorBoundary(deckExists), read],
    update: [
        asyncErrorBoundary(deckExists),
        hasOnlyValidProperties,
        update
    ]
};