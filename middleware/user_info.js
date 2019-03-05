const pg_client = require("../elephantSql.js");

const createUserInfo = (req, res, next) => {
  const { uid, firstname, lastname } = req.body;
  console.log("CREATING USER", uid, firstname, lastname);
  const date = new Date();

  const query = `INSERT INTO user_info(uid, firstname, lastname, createdAt)
  VALUES ($1, $2, $3, $4);`;

  const values = [uid, firstname, lastname, date];

  pg_client
    .query(query, values)
    .then(() => {
      console.log("success inserting user");
      // next();
      res.status(200).send("success");
    })
    .catch(err => {
      res.status(400).send("failure to create user");
      console.log(err);
    });
};

const checkEmailAvailability = (req, res, next) => {
  const { email } = req.body;

  const query = `SELECT *
  FROM user_info
  WHERE uid = '123'`;

  pg_client(query)
    .then(data => {
      console.log("FOUND USER", data);
      res.status(200).send(JSON.stringify(data));
    })
    .catch(err => {
      res.status(400).send(JSON.stringify(err));
    });
};

module.exports = { createUserInfo, checkEmailAvailability };
