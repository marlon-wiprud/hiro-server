const express = require("express");
const app = new express();
const port = 3000;
const path = require("path");
const bodyParser = require("body-parser");

const {
  createUserInfo,
  checkEmailAvailability
} = require("./middleware/user_info");

const { insertGenre } = require("./middleware/favorite_genre");
const { insertArtist } = require("./middleware/favorite_artist");

const { parseEmotion, detectEmotion } = require("./middleware/detect_mood")

app.use(bodyParser.json({limit: '50MB'}));
app.use(bodyParser.urlencoded({extended: true}))

app.post('/mood',detectEmotion,parseEmotion)

app.post("/user", createUserInfo);

app.get("/user", checkEmailAvailability);

app.post("/genre", insertGenre);

app.post("/artist", insertArtist);

app.listen(port, () => {
  console.log(`listening on port ${3000}`);
});
