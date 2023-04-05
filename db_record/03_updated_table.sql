CREATE TABLE department(
id serial primary key unique not null,
name varchar(20) unique not null
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY unique not null,
  name VARCHAR(35)  unique not null, 
  email VARCHAR(40) unique not null,
  password VARCHAR(30) not null,
  phone_number VARCHAR(25),
  role VARCHAR(15) not null,
  hire_date DATE not null,
  department_id integer not null,
  FOREIGN KEY (department_id) REFERENCES department(id)
);


CREATE TABLE claim(
    id serial primary key not null unique,
    claim_type varchar(20) not null,
    transaction_date date not null,
    amount decimal(8,2) not null,
    claim_description varchar(255),
    date_of_submission date not null,
    status varchar(16) not null,
    employee_id integer not null,
    department_id integer not null,
    foreign key (employee_id) references employee(id),
    foreign key (department_id) references department(id)
);

CREATE TABLE file (
  id SERIAL PRIMARY KEY not null unique,
  file_name VARCHAR(255) not null,
  created_at date not null,
  claim_id INTEGER not null,
  FOREIGN KEY (claim_id) REFERENCES claim(id)
);

insert into department(name) values ('Accounting Team'),
('Sales Team'),('IT');

insert into employee(name, email, password, phone_number, role, hire_date, department_id) values
('Alice','alice@tecky.com','1234', '12345678', 'user', '2023-01-01','2'),
('Bob', 'bob@tecky.com', '1234','87654321', 'admin', '2023-01-01', '1'),
('Mic', 'micsum@connect.hku.hk', '1234','87654320', 'admin', '2023-01-01', '3');

ALTER TABLE claim
DROP COLUMN authorizing_officer_id;

ALTER TABLE employee
ALTER COLUMN password
TYPE VARCHAR(255);


CREATE TABLE reject(
id serial primary key unique not null,
reasons varchar(255) unique not null,
claim_id INTEGER not null,
reject_date date not null,
FOREIGN KEY (claim_id) REFERENCES claim(id)
);