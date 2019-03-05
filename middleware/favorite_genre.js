const pg_client = require("../elephantSql.js");

const initialGenreInsert = (req, res, next) => {
  const { uid, genreArr } = req.body;

  const promiseArr = [];

  genreArr.forEach(genre => {
    const a = new Promise((resolve, reject) => {
      const query = `INSERT INTO favorite_genre(uid, genre, createdAt)
      VALUES ($1, $2, $3);`;

      const date = new Date();
      const values = [uid, genre, date];

      pg_client
        .query(query, values)
        .then(() => {
          console.log("successfully inserted favorite genre");
          resolve();
        })
        .catch(err => {
          res.status(400).send("failure");
          reject();
          console.log(err);
        });
    });
    promiseArr.push(a);
  });

  Promise.all(promiseArr)
    .then(() => {
      console.log("INSERTED ALL GENRES");
      // next();
      res.status(200).send("success");
    })
    .catch(err => res.status(400).send(JSON.stringify(err)));
};

const insertGenre = (req, res, next) => {
  const { uid, genreArr } = req.body;

  const promiseArr = [];

  genreArr.forEach(genre => {
    const a = new Promise((resolve, reject) => {
      const query = `INSERT INTO favorite_genre(uid, genre, createdAt)
      VALUES ($1, $2, $3);`;

      const date = new Date();
      const values = [uid, genre, date];

      pg_client
        .query(query, values)
        .then(() => {
          console.log("successfully inserted favorite genre");
          resolve();
        })
        .catch(err => {
          res.status(400).send("failure");
          reject();
          console.log(err);
        });
    });
    promiseArr.push(a);
  });

  Promise.all(promiseArr)
    .then(() => {
      console.log("INSERTED ALL GENRES");
      // next();
      res.status(200).send("success");
    })
    .catch(err => res.status(400).send(JSON.stringify(err)));
};

module.exports = { initialGenreInsert, insertGenre };
