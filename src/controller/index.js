const app = require("express")();
const auth = require("./auth");

app.use("/auth", auth);

module.exports = app;
