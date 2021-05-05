CREATE DATABASE shared_list;

CREATE TABLE list_item(
  item_id SERIAL PRIMARY KEY,
  description VARCHAR(255)
);