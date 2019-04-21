const pg_client = require("../../elephantSql.js");

const addFavorite = (req, res, next) => {
  const { uid } = req.params;

  const {
    albumCoverArtURL,
    duration,
    albumUri,
    albumName,
    artistUri,
    artistName,
    uri,
    name
  } = req.body;

  const date = new Date();

  const values = [
    uid,
    albumCoverArtURL,
    duration,
    albumUri,
    albumName,
    artistUri,
    artistName,
    uri,
    name,
    date
  ];

  const query = `INSERT INTO user_favorites(
      uid,
      albumCoverArtURL,
      duration,
      albumUri,
      albumName,
      artistUri,
      artistName,
      uri,
      name,
      createdAt
  )
   VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;

  pg_client
    .query(query, values)
    .then(data => {
      console.log("INSERTED: ", data);
      next();
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(JSON.stringify({ message: "fail" }));
    });
};

const getFavorites = (req, res, next) => {
  const { uid } = req.params;
  pg_client
    .query(
      `SELECT * 
       FROM user_favorites
       WHERE uid='${uid}';`
    )
    .then(data => {
      res.locals.favorites = data.rows;
      next();
    })
    .catch(err => {
      console.log(err);
      res.status(200).send(JSON.stringify({ error: "error" }));
    });
};

const buildFavoritesLookup = (req, res, next) => {
  const data = res.locals.favorites;

  const dictionary = {};

  for (let i = 0; i < data.length; i++) {
    dictionary[data[i].uri] = 1;
  }

  const responseObj = { favsDictionary: dictionary, favsArray: data };

  console.log("dictoionary---->", dictionary);
  res.status(200).send(JSON.stringify(responseObj));
};

const deleteFavorite = (req, res, next) => {
  const { uid } = req.params;
  const { uri } = req.body;

  console.log("URI--->", uri);
  console.log("UID--->", uid);
  const query = `DELETE FROM user_favorites WHERE uri='${uri}' AND uid='${uid}';`;

  pg_client
    .query(query)
    .then(data => {
      console.log("DELETE -->", data);
      next();
    })
    .catch(err => console.log(err));
};

module.exports = {
  addFavorite,
  getFavorites,
  buildFavoritesLookup,
  deleteFavorite
};
