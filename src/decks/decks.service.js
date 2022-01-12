const knex = require("../db/connection");

function list() {
    return knex("decks").select("*");
}

module.exports = {
    list,
}