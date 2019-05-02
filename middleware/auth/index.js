const signup = require("./signup");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const pg_client = require("../../elephantSql");
const bcrypt = require("bcrypt");

passport.use(
  "local",
  new LocalStrategy(
    { passReqToCallback: true },
    (req, email, password, done) => {
      // select user details where email = username
      const query = `SELECT * 
   FROM users
   WHERE email='${email.toLowerCase()}';`;

      pg_client
        .query(query)
        .then(data => {
          if (data.rowCount === 0) {
            return done(null, false);
          } else {
            // compare passwords with bcrypt
            bcrypt.compare(password, data.rows[0].password, (err, check) => {
              if (err) {
                return done();
              } else if (check) {
                // finish with success
                const userInfo = data.rows[0];
                return done(null, [userInfo], { message: "hello" });
              } else {
                return done(null, false);
              }
            });
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
  )
);

passport.serializeUser(function(user, done) {
  done(null, user);
});

passport.deserializeUser(function(user, done) {
  done(null, user);
});

module.exports = { signup };
