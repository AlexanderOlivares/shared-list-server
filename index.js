const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

// register and login routes
app.use("/auth", require("./routes/jwtAuth"));

// dashboard route
app.use("/dashboard", require("./routes/dashboard"));

app.post("/resetpassword", async (req, res) => {
  const { emailOfResetUser } = req.body;
  try {
    // check if user doesn't exist
    console.log(emailOfResetUser);
    const user = await pool.query(
      "SELECT user_name, user_id FROM users WHERE user_email = $1",
      [emailOfResetUser]
    );

    if (user.rows.length === 0) {
      return res.status(401).json("No account found with this email address.");
    }

    console.log(user.rows);
    res.json(user.rows);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
