const pg_client = require("../../elephantSql.js");
const bcrypt = require("bcrypt");
const uuid = require("uuid/v4");

const checkIfUserExists = (req, res, next) => {
  console.log("checking if user exists...");
  const { email, password } = req.body;
  const query = `SELECT * FROM users WHERE email='${email}'`;
  pg_client.query(query).then(data => {
    console.log("sign up -->", data);
    if (data.rows.length === 0) {
      next();
    } else {
      res.status(400).send({ message: "user already exists" });
    }
  });
};

const insertNewUser = async (req, res, next) => {
  console.log("inserting new user...");
  const { email, password, firstname, lastname } = req.body;
  const pwd = await bcrypt.hash(password, 5);
  const date = new Date();
  console.log("encrypted password -->", pwd);
  const uid = uuid();
  console.log("uid signup -->", uid);

  const query = `INSERT INTO users(
    uid,
    firstname,
    lastname,
    password,
    email,
    createdAt
  )
  VALUES($1,$2,$3,$4,$5,$6)
  RETURNING *`;

  const values = [
    uid,
    firstname.toLowerCase(),
    lastname.toLowerCase(),
    pwd,
    email.toLowerCase(),
    date
  ];

  pg_client
    .query(query, values)
    .then(data => {
      console.log("INSERTED new user successfully");
      const { uid, firstname, lastname, email } = data.rows[0];
      res.status(200).send(JSON.stringify({ uid, firstname, lastname, email }));
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(JSON.stringify({ message: "failure" }));
    });
};

module.exports = { checkIfUserExists, insertNewUser };
