const jwt = require("jsonwebtoken");
require("dotenv").config();

// changed the payload structure
function jwtGenerator(user_id) {
  const payload = {
    user: {
      id: user_id,
    },
  };

  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;
