const jwt = require("jsonwebtoken");
const { redisCli } = require("../../redis");

const generateToken = async (id, isAccess) => {
  const salt = process.env.SECRET_OR_PRIVATE;

  const token = jwt.sign({ id }, salt, {
    algorithm: "HS256",
    expiresIn: isAccess ? "2h" : "7d"
  });

  return token;
};

const refresh = async (req, res) => {
  const token = await req.get("authorization").split(" ")[1];

  if (!req.payload) {
    return res.status(400).json({
      error: "확인할 수 없는 토큰입니다"
    });
  }

  await redisCli.get(token, async (err, value) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    const accessToken = await generateToken(value, true);
    redisCli.set(value, accessToken);

    return res.status(200).json({
      accessToken: accessToken,
      refreshToken: value
    });
  });
};

module.exports = {
  generateToken,
  refresh
};
