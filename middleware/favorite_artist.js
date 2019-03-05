const pg_client = require("../elephantSql.js");

const initialArtistInsert = (req, res, next) => {
  const { uid, favoriteArtist } = req.body;

  const query = `INSERT INTO favorite_artist(uid, artist, createdAt)
    VALUES ($1, $2, $3);`;

  const date = new Date();
  const values = [uid, favoriteArtist, date];

  pg_client
    .query(query, values)
    .then(() => {
      console.log("success inserting favorite artist");
    })
    .catch(err => {
      res.status(400).send("failure");
      console.log(err);
    });

  res.status(200).send("success");
};
///////////////////////////////////////
const insertArtist = (req, res, next) => {
  const { uid, favoriteArtist } = req.body;

  const query = `INSERT INTO favorite_artist(uid, artist, createdAt)
    VALUES ($1, $2, $3);`;

  const date = new Date();
  const values = [uid, favoriteArtist, date];

  pg_client
    .query(query, values)
    .then(() => {
      console.log("success inserting favorite artist");
    })
    .catch(err => {
      res.status(400).send("failure");
      console.log(err);
    });

  res.status(200).send("success");
};
module.exports = { initialArtistInsert, insertArtist };
