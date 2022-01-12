const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const decksService = require("./decks.service");

async function list(req, res) {
    const data = await decksService.list();
    res.json({ data });
}

module.exports = {
    list: asyncErrorBoundary(list),
};