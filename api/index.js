const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const passportJWT = require("passport-jwt");
const jwt = require("jsonwebtoken");
const { RBAC } = require("rbac");
const { Op } = require("sequelize");
const { User } = require("./models");
const cors = require("cors");

const { Strategy, ExtractJwt } = passportJWT;

const app = express();
app.use(bodyParser.json());

// Setup Passport.js
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "secret_key", // Change this to a secure key in production
};
app.use(cors());

passport.use(
  new Strategy(jwtOptions, async (payload, done) => {
    const currentTime = Date.now();
    // set 5 minute expair token time
    if (payload.time + 1000 * 60 * 5 < currentTime) {
      return done(null, false);
    } else {
      const user = await User.findOne({
        where: { id: payload.id },
        include: ["Role"],
        rows: true,
      });
      if (user) {
        return done(null, user.dataValues);
      } else {
        return done(null, false);
      }
    }
  })
);
app.use("/medication", passport.authenticate("jwt", { session: false }), require("./routes/medication"));
app.use("/customer", passport.authenticate("jwt", { session: false }), require("./routes/customer"));
app.use("/user", passport.authenticate("jwt", { session: false }), require("./routes/user"));

// Routes
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ where: { [Op.and]: [{ userName: username }, { password: password }] } });
  if (user) {
    const time = Date.now();
    const token = jwt.sign({ id: user.id, time: time }, jwtOptions.secretOrKey);

    res.json({
      accessToken: token,
    });
  } else {
    res.status(401).json({ message: "Invalid username or password" });
  }
});

// Start the server
const port = process.env.PORT || 3000;

app.listen(port, async () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
