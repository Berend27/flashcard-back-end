const knex = require("../db/connection");

// todo: create, read, update, delete

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
    list,
    read,
}