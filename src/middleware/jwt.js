const jwt = require("jsonwebtoken");
const { isJwt } = require("validator");
const { configDotenv } = require("dotenv");
const { createTransport } = require("nodemailer");
const { redisCli } = require("../redis");

configDotenv();

const validateAccess = async (req, res, next) => {
  try {
    const authorization = req.get("authorization");
    if (!authorization || !authorization.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "JWT 유효성 검증 실패"
      });
    }

    const token = authorization.split(" ")[1];
    if (!isJwt(token)) {
      return res.status(401).json({
        error: "JWT 유효성 검증 실패"
      });
    }

    const salt = process.env.SECRET_OR_PRIVATE;

    req.payload = jwt.verify(token, salt, {
      algorithms: "HS256"
    });

    next();
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: err
    });
  }
};

const validateWithMail = async (req, res) => {
  const emailId = process.env.EMAIL_ID;
  const emailPw = process.env.EMAIL_PW;

  const { email } = req.body;

  const transport = createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: emailId,
      pass: emailPw
    }
  });

  try {
    const random = Math.random().toString(36).slice(2, 10);

    await transport.sendMail({
      from: emailId,
      to: email,
      subject: "Road 임시 비밀번호",
      text: `임시 비밀번호는 ${random}`
    });

    redisCli.set(email, random);

    return res.status(200).json({
      message: "메일이 발송되었습니다."
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err
    });
  }
};

module.exports = {
  validateAccess,
  validateWithMail
};
