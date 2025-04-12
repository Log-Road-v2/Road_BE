const app = require("express")();
const auth = require("../service/auth");

app.post("/refresh", auth.refresh);

module.exports = app;
