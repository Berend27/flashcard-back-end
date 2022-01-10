const { PORT = 5000 } = process.env;
const app = require("./app");

const listenerCallback = () => console.log("server started");
app.listen(PORT, listenerCallback);