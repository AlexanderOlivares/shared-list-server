const router = require("express").Router();
const pool = require("../db");
const authorization = require("../middleware/authorization");

// all items and name
router.get("/", authorization, async (req, res) => {
  console.log(req.user.email);
  console.log(req.user.guests);
  try {
    const user = await pool.query(
      // "SELECT item_id, description FROM list_item WHERE creator = $1 OR editors = $1",
      // [req.user.email]
      "SELECT creator_name, editors_name, item_id, description FROM list_item WHERE creator = $1 OR editors = $1",
      [req.user.email] //, req.user.guests]
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
      "INSERT INTO list_item (user_id, description, creator, creator_name, editors, editors_name) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [
        req.user.id,
        description,
        req.user.email,
        req.user.name,
        req.user.guests,
        req.user.guestsName,
      ]
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
    console.log(id, description, req.user.email, req.user.guests);
    const updateItem = await pool.query(
      "UPDATE list_item SET description = $1 WHERE (item_id = $2) AND (editors = $3 OR editors = $4 OR creator = $3 OR creator = $4) RETURNING *",
      [description, id, req.user.guests, req.user.email]
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
      "DELETE FROM list_item WHERE (item_id = $1) AND (editors = $2 OR editors = $3 OR creator = $2 OR creator = $3) RETURNING *",
      [id, req.user.email, req.user.guests]
    );
    console.log(deleteItem.rows);

    if (deleteItem.rows.length === 0) {
      return res.json("You are not authorized to delete this item");
    }

    res.json("Item deleted");
  } catch (err) {
    console.error(err.message);
  }
});

module.exports = router;
