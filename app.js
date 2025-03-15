const express = require("express");
const cors = require("cors");

const RegisterRoute = require("./Routes/Register");
const port = process.env.PORT || 4000;
const app = express();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/register", RegisterRoute);
app.use("/", (req, res, next) => {
  res.status(404).json({
    status: "fail",
    ok: false,
    message: "No such route founded in server...💣💣💣",
  });
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
    return;
  }
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
