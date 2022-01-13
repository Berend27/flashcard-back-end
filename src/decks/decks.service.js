const knex = require("../db/connection");

// todo: update, delete

function create(deck) {
    return knex("decks")
        .insert(deck)
        .returning("*")
        .then((createdRecords) => createdRecords[0]);
}

function list() {
    return knex("decks").select("*");
}

function read(id) {
    return knex("decks")
        .select("*")
        .where({ id })
        .first();
}

module.exports = {
    create,
    list,
    read,
}