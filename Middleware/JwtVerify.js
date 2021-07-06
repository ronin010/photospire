const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["authorization"];

  if (typeof token !== "undefined") {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
      } else {
        req.user = decoded
        next()
      }
    })
  } else {
    res.sendStatus(403);
  }
}