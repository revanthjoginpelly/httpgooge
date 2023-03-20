require("dotenv").config();
const fs = require("fs");
const http = require("http");
const express = require("express");
const passport = require("passport");
const bodyParser = require("body-parser");
const { Strategy } = require("passport-google-oauth20");

const { user_model, conenctMongo } = require("./mongoose");
const e = require("express");

const port = 3000;

const config = {
  CLIENT_ID: process.env.CLIENT_ID,
  CLIENT_SECRET: process.env.CLIENT_SECRET,
};

async function findId(filter) {
  return await user_model.findOne(filter);
}

const StrategyOptions = {
  callbackURL: "/auth/google/callback",
  clientID: config.CLIENT_ID,
  clientSecret: config.CLIENT_SECRET,
};

async function verifyCallback(accessToken, refreshToken, profile, done) {
  const filter = { gooogleId: profile.id };
  //    const user=user_model.findOne({
  //     'googleId': profile.id
  // })
  //     console.log('user:',user)
  const user = await findId(filter);
  if (!user) {
    const newOne = new user_model({
      email: profile.emails[0].value,
      googleId: profile.id,
    });

    newOne.save();
  }

  console.log("google profile", profile);
  done(null, profile);
}

passport.use(new Strategy(StrategyOptions, verifyCallback));

const app = express();

app.use(express.json());

app.use(bodyParser.urlencoded({ extended: false }));

app.use(passport.initialize());

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["email"],
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/failure",
    successRedirect: "/",
    session: false,
  }),
  (req, res) => {
    console.log("google called us");
  }
);

app.get("/failure", (req, res) => {
  res.send("login failed");
});

app.post("/register", (req, res) => {
  res.write("sucesfully registerd\n");
  //res.write(`username : ${req.body.username} and password: ${req.body.password}`)
  res.end();
});

app.get("/", (req, res) => {
  res.sendFile("index.html", { root: "public" });
});
async function startserver() {
  await conenctMongo();

  http.createServer(app).listen(port, (req, res) => {
    console.log(`listening on port ${port}`);
  });
}
startserver();
