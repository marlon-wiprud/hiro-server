const express = require("express");
const app = new express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");
const {
  createUserInfo,
  checkEmailAvailability
} = require("./middleware/user_info");
const {
  insertGenre,
  initialGenreInsert
} = require("./middleware/favorite_genre");
const {
  insertArtist,
  initialArtistInsert
} = require("./middleware/favorite_artist");

app.use(bodyParser());

// app.post(
//   "/createUser",
//   createUserInfo,
//   initialGenreInsert,
//   initialArtistInsert
// );

app.post("/user", createUserInfo);

app.get("/user", checkEmailAvailability);

app.post("/genre", insertGenre);

app.post("/artist", insertArtist);

app.listen(port, () => {
  console.log(`listening on port ${3000}`);
});
