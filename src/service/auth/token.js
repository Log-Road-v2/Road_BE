const jwt = require("jsonwebtoken");
const { redisCli } = require("../../redis");

const generateAccessToken = async (id, isAccess) => {
  const salt = process.env.SECRET_OR_PRIVATE;

  const access = jwt.sign({ id }, salt, {
    algorithm: "HS256",
    expiresIn: isAccess ? "30s" : "7d"
  });

  return access;
};

module.exports = {
  generateAccessToken
};
