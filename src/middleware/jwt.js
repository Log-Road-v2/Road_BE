const jwt = require("jsonwebtoken");
const { isJwt } = require("validator");
const { configDotenv } = require("dotenv");

configDotenv();

const validatorAccess = async (req, res, next) => {
  try {
    const authorization = req.get("authorization")?.split(" ")[1];
    if (!authorization) {
      return res.status(401).json({
        error: "JWT 유효성 검증 실패"
      });
    }
    if (!isJwt(authorization)) {
      return res.status(401).json({
        error: "JWT 유효성 검증 실패"
      });
    }

    const salt = process.env.SECRET_OR_PRIVATE;

    req.payload = jwt.verify(authorization, salt, {
      algorithms: "HS256"
    });
    next();
  } catch (err) {
    console.error(e);
    return res.status(400).json({
      error: err
    });
  }
};

module.exports = {
  validatorAccess
};
