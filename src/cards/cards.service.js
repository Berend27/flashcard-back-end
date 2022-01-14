const knex = require("../db/connection");

// todo: read, create, delete, update



function listForDeck(deckId) {
    return knex("cards")
        .select("*")
        .where({ deckId });
}

function read(id) {
    return knex("cards")
        .select("*")
        .where({ id })
        .first();
}

module.exports = {
    listForDeck,
    read,
}