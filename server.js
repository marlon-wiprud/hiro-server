const express = require("express");
const app = new express();
const port = 3000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const passport = require("passport");
const expressSession = require("express-session");
const bcrypt = require("bcrypt");
const pg_client = require("./elephantSql");
const pg = require("pg");
const pgSession = require("connect-pg-simple")(expressSession);

const auth = require("./middleware/auth");
const { login, attachFavoritesToUser } = require("./middleware/auth/login");
const {
  createUserInfo,
  checkEmailAvailability
} = require("./middleware/user_info");

const { insertGenre } = require("./middleware/favorite_genre");
const { insertArtist } = require("./middleware/favorite_artist");

const { parseEmotion, detectEmotion } = require("./middleware/detect_mood");

const { tokenSwap, tokenRefresh } = require("./middleware/spotifyTokens");

const {
  addFavorite,
  getFavorites,
  buildFavoritesLookup,
  deleteFavorite
} = require("./middleware/favorites");

app.use(bodyParser.json({ limit: "50MB" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(passport.initialize());
app.use(passport.session());

const cookieSecret = process.env.COOKIE_SECRET;
// session
app.use(
  expressSession({
    store: new pgSession({
      pool: pg_client, // Connection pool
      tableName: "session" // Use another table-name than the default "session" one
    }),
    secret: process.env.COOKIE_SECRET,
    resave: false,
    cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
  })
);

//

// signup
app.post("/signup", auth.signup.checkIfUserExists, auth.signup.insertNewUser);

// runs login details through passport. if second function gets ran, user is authenticated. 401 will get sent otherwise
app.post(
  "/login",
  passport.authenticate("local"),
  login,
  getFavorites,
  buildFavoritesLookup,
  attachFavoritesToUser
);

app.get("/logout", (req, res) => {
  console.log("is user authenticated --> ", req.isAuthenticated());
  req.logout();
  console.log("is user authenticated --> ", req.isAuthenticated());
  res.status(200).send({ message: "successfully logged out" });
});

app.post("/mood", detectEmotion, parseEmotion);

app.post("/user", createUserInfo);

app.get("/user", checkEmailAvailability);

app.post("/genre", insertGenre);

app.post("/artist", insertArtist);

// swap spotify token
app.post("/swap", tokenSwap);
// refresh spotify token
app.post("/refresh", tokenRefresh);

// add favorite - returns new fav list
app.post(
  "/favorites/:uid",
  addFavorite,
  getFavorites,
  buildFavoritesLookup,
  (req, res) => {
    const { favoritesLookup, favorites } = res.locals;
    const responseObj = {
      favsDictionary: favoritesLookup,
      favsArray: favorites
    };
    res.status(200).send(JSON.stringify(responseObj));
  }
);

// get favorites
app.get("/favorites/:uid", getFavorites, buildFavoritesLookup);

// unfavorite - returns new fav list
app.delete(
  "/favorites/:uid",
  deleteFavorite,
  getFavorites,
  buildFavoritesLookup
);

app.listen(port, () => {
  console.log(`listening on port ${port}...`);
});
