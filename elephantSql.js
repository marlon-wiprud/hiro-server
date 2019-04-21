const pg = require("pg");

const conString =
  "postgres://bdumeijv:JPb3WK-yN13VFozGQ3xf4mEH0yge5wEx@baasu.db.elephantsql.com:5432/bdumeijv"; //Can be found in the Details page
const pg_client = new pg.Client(conString);

pg_client.connect(err => {
  if (err) {
    return console.error("could not connect to postgres", err);
  }

  pg_client
    .query(
      `CREATE TABLE IF NOT EXISTS user_info(
    _id SERIAL UNIQUE,
    uid VARCHAR UNIQUE,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    createdAt timestamp NOT NULL,
    updatedAt timestamp,
    PRIMARY KEY (uid)
  )`
    )
    .catch(err => {
      // console.log(err);
      console.log("user info already exists");
    });

  pg_client
    .query(
      `CREATE TABLE IF NOT EXISTS favorite_genre(
    _id SERIAL UNIQUE,
    uid VARCHAR,
    genre VARCHAR(20) NOT NULL,
    createdAt timestamp NOT NULL,
    updatedAt timestamp,
    PRIMARY KEY (_id),
    FOREIGN KEY (uid) REFERENCES user_info(uid)
  )`
    )
    .catch(err => {
      console.log(err);
    });

  pg_client
    .query(
      `CREATE TABLE IF NOT EXISTS favorite_artist(
    _id SERIAL UNIQUE,
    uid VARCHAR,
    artist VARCHAR(100) UNIQUE NOT NULL,
    createdAt timestamp NOT NULL,
    updatedAt timestamp,
    PRIMARY KEY (_id),
    FOREIGN KEY (uid) REFERENCES user_info(uid)
  )`
    )
    .catch(err => {
      console.log(err);
    });

  pg_client
    .query(
      `CREATE TABLE IF NOT EXISTS user_favorites(
    _id SERIAL UNIQUE,
    uid VARCHAR,
    albumCoverArtURL VARCHAR,
    duration FLOAT,
    albumUri VARCHAR,
    albumName VARCHAR,
    artistUri VARCHAR,
    artistName VARCHAR,
    uri VARCHAR,
    name VARCHAR,
    createdAt timestamp NOT NULL
  )`
    )
    .catch(err => {
      console.log(err);
    });
});

module.exports = pg_client;
