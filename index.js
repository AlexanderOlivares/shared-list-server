const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.use(cors());
app.use(express.json());

// register and login routes
app.use("/auth", require("./routes/jwtAuth"));

// create item
app.post("/items", async (req, res) => {
  try {
    const { description } = req.body;
    const newItem = await pool.query(
      "INSERT INTO list_item (description) VALUES($1) RETURNING *",
      [description]
    );
    res.json(newItem.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get all items
app.get("/items", async (req, res) => {
  try {
    const allItems = await pool.query("SELECT * FROM list_item");
    res.json(allItems.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get a list item
app.get("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const listItem = await pool.query(
      "SELECT * FROM list_item WHERE item_id = $1",
      [id]
    );
    res.json(listItem.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update item
app.put("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateItem = await pool.query(
      "UPDATE list_item SET description = $1 WHERE item_id = $2",
      [description, id]
    );
    res.json("item updated");
  } catch (err) {
    console.error(err.message);
  }
});

// delete item
app.delete("/items/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteItem = await pool.query(
      "DELETE FROM list_item WHERE item_id = $1",
      [id]
    );
    res.json("item was deleted");
  } catch (err) {
    console.error(err.message);
  }
});

app.listen(5000, () => {
  console.log("Listening on port 5000");
});
