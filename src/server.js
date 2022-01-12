const app = require("./app");
const knex = require("./db/connection");

const { PORT = 5000 } = process.env;

const listenerCallback = () => console.log(`Listening on Port ${PORT}`);

knex.migrate 
    .latest()
    .then((migrations) => {
        console.log("migratioins", migrations);
        app.listen(PORT, listenerCallback);
    })
    .catch((error) => {
        console.error(error);
        knex.destroy();
    });