const app = require("express")();
const auth = require("../service/auth");
const { validateAccess, validateWithMail } = require("../middleware/jwt");

app.post("/refresh", validateAccess, auth.refresh);

module.exports = app;
