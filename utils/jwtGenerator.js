const jwt = require("jsonwebtoken");
require("dotenv").config();

// changed the payload structure
function jwtGenerator(user_id, user_email, guests_email) {
  const payload = {
    user: {
      id: user_id,
      email: user_email,
      guests: guests_email,
    },
  };

  console.log(payload);
  return jwt.sign(payload, process.env.jwtSecret, { expiresIn: "1hr" });
}

module.exports = jwtGenerator;
