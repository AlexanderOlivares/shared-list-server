const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// all items and name
router.get("/", authorization, async (req, res) => {
  console.log(req.user.guests);
  console.log(req.user.email);
  try {
    const user = await pool.query(
      // "SELECT users.user_name, users.guests_email, list_item.item_id, list_item.description FROM users LEFT JOIN list_item ON users.user_id = list_item.user_id WHERE users.user_id = $1 OR users.guests_email = $2",
      "SELECT description FROM list_item WHERE creator = $1 OR editors = $1",
      [req.user.email]
    );
    res.json(user.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json(err.message);
  }
});

// create an item
router.post("/items", authorization, async (req, res) => {
  try {
    const { description } = req.body;
    const newItem = await pool.query(
      "INSERT INTO list_item (user_id, description, creator, editors) VALUES($1, $2, $3, $4) RETURNING *",
      [req.user.id, description, req.user.email, req.user.guests]
    );
    res.json(newItem.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// update item
router.put("/items/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateItem = await pool.query(
      "UPDATE list_item SET description = $1 WHERE item_id = $2 AND user_id = $3 RETURNING *",
      [description, id, req.user.id]
    );

    if (updateItem.rows.length === 0) {
      return res.json("this is not your item to change");
    }

    res.json("item updated");
  } catch (err) {
    console.error(err.message);
  }
});

// delete item
router.delete("/items/:id", authorization, async (req, res) => {
  try {
    const { id } = req.params;
    const deleteItem = await pool.query(
      "DELETE FROM list_item WHERE item_id = $1 AND user_id = $2 RETURNING *",
      [id, req.user.id]
    );

    if (deleteItem.rows.length === 0) {
      return res.json("You are not authorized to delete this item");
    }

    res.json("Item deleted");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
