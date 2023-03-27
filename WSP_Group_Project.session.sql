CREATE DATABASE wsp_group_project;

CREATE TABLE file
(
  id        SERIAL        NOT NULL,
  file_name VARCHAR (255) NOT NULL,
  created_at TIMESTAMP    NOT NULL,
  PRIMARY KEY (id)
);
