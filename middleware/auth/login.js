const pg_client = require("../../elephantSql");

const login = (req, res, next) => {
  if (req.body.remember) {
    req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // Cookie expires after 30 days
  } else {
    req.session.cookie.expires = false; // Cookie expires at end of session
  }
  next();
  // goes next to getFavorites function
};

const attachFavoritesToUser = (req, res) => {
  //recieves favorites from getFavorites function
  // recieves favoritesLookup from buildFavoritesLookup function

  const user = req.user[0];
  const { favorites, favoritesLookup } = res.locals;
  console.log(111111);
  res.status(200).send(JSON.stringify({ ...user, favorites, favoritesLookup }));
};

module.exports = { login, attachFavoritesToUser };
