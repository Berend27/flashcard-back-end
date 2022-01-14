const knex = require("../db/connection");

function create(card) {
    return knex("cards")
        .insert(card)
        .returning("*")
        .then(createdRecords => createdRecords[0]);
}

function destroy(id) {
    return knex("cards")
        .where({ id })
        .del();
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

function update(card) {
    return knex("cards")
        .select("*")
        .where({ id: card.id })
        .update(card, "*")
        .then(updatedRecords => updatedRecords[0]);
}

module.exports = {
    create,
    destroy,
    listForDeck,
    read,
    update
}