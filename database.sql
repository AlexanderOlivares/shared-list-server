CREATE DATABASE shared_list;

CREATE TABLE list_item(
  item_id SERIAL PRIMARY KEY,
  description VARCHAR(255)
);

CREATE TABLE users(
  user_id SERIAL PRIMARY KEY,
  user_name  VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password  VARCHAR(255) NOT NULL
)