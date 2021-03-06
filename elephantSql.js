const pg = require("pg");

const conString =
  "postgres://bdumeijv:JPb3WK-yN13VFozGQ3xf4mEH0yge5wEx@baasu.db.elephantsql.com:5432/bdumeijv"; //Can be found in the Details page
const pg_client = new pg.Client(conString);

pg_client.connect(err => {
  if (err) {
    return console.error("could not connect to postgres", err);
  }

  // users table
  pg_client
    .query(
      `CREATE TABLE IF NOT EXISTS users(
    _id SERIAL UNIQUE,
    uid VARCHAR UNIQUE NOT NULL,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    password VARCHAR(60) NOT NULL,
    email VARCHAR(100) NOT NULL,
    createdAt timestamp NOT NULL,
    updatedAt timestamp,
    PRIMARY KEY (uid)
  )`
    )
    .catch(err => {
      console.log("user info already exists");
    });

  // favorite_genre table
  pg_client
    .query(
      `CREATE TABLE IF NOT EXISTS favorite_genre(
    _id SERIAL UNIQUE,
    uid VARCHAR NOT NULL,
    genre VARCHAR(20) NOT NULL,
    createdAt timestamp NOT NULL,
    updatedAt timestamp,
    PRIMARY KEY (_id),
    FOREIGN KEY (uid) REFERENCES users(uid)
  )`
    )
    .catch(err => {
      console.log(err);
    });

  // favorite_artist table
  pg_client
    .query(
      `CREATE TABLE IF NOT EXISTS favorite_artist(
    _id SERIAL UNIQUE,
    uid VARCHAR NOT NULL,
    artist VARCHAR(100) UNIQUE NOT NULL,
    createdAt timestamp NOT NULL,
    updatedAt timestamp,
    PRIMARY KEY (_id),
    FOREIGN KEY (uid) REFERENCES users(uid)
  )`
    )
    .catch(err => {
      console.log(err);
    });

  // user_favorites table
  pg_client
    .query(
      `CREATE TABLE IF NOT EXISTS user_favorites(
    _id SERIAL UNIQUE,
    uid VARCHAR NOT NULL,
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

  // session store table
  // pg_client
  //   .query(
  //     `
  //   CREATE TABLE IF NOT EXISTS "session" (
  //     "sid" varchar NOT NULL COLLATE "default",
  //     "sess" json NOT NULL,
  //     "expire" timestamp(6) NOT NULL
  //   )
  //   WITH (OIDS=FALSE);
  //   ALTER TABLE "session" ADD CONSTRAINT "session_pkey" PRIMARY KEY ("sid") NOT DEFERRABLE INITIALLY IMMEDIATE;
  //   `
  //   )
  //   .catch(err => console.log(err));
});

module.exports = pg_client;
