const express = require("express");
const app = new express();
const port = 3000;
const bodyParser = require("body-parser");

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
app.post("/favorites/:uid", addFavorite, getFavorites, buildFavoritesLookup);

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
