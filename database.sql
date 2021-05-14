CREATE DATABASE shared_list;

CREATE TABLE list_item(
  item_id SERIAL,
  user_id uuid,
  description VARCHAR(255) NOT NULL,
  PRIMARY KEY (item_id),
  FOREIGN KEY (user_id) REFERENCES users (user_id)
);

CREATE TABLE users(
  user_id UUID DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password  VARCHAR(255) NOT NULL,
  PRIMARY KEY (user_id)
)