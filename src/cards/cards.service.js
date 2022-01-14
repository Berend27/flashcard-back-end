const knex = require("../db/connection");

// todo: create, delete, update

function create(card) {
    return knex("cards")
        .insert(card)
        .returning("*")
        .then(createdRecords => createdRecords[0]);
}

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
    create,
    listForDeck,
    read,
}