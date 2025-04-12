const express = require("express");
const cors = require("cors");
const { configDotenv } = require("dotenv");

const router = require("./controller");
const { sequelize } = require("./model");
const { redisCli } = require("./redis");

configDotenv();
const port = process.env.SERVER_PORT || 8080;

const app = express();

app.use(express.urlencoded({ extended: true }));

app.use(express.json());
app.use(
  cors({
    origin: "localhost",
    methods: ["POST", "GET", "PUT", "PATCH", "DELETE"],
    credentials: true
  })
);

app.use("/", router);

app.listen(port, async () => {
  console.log(`Server is running on ${port}`);

  await redisCli.connect();

  await sequelize
    .sync({ force: true })
    .then(() => {
      console.log("DB has initted");
    })
    .catch((err) => {
      console.error(err);
    });
});
