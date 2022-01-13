const knex = require("../db/connection");

// todo: listForDeck, read, create, delete, update

function listForDeck(deckId) {
    return knex("cards")
        .select("*")
        .where({ deckId });
}

module.exports = {
    listForDeck,
}