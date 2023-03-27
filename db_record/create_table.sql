CREATE TABLE department(
id serial primary key,
name varchar(20)
);

CREATE TABLE employee (
  id SERIAL PRIMARY KEY,
  name VARCHAR(35),
  email VARCHAR(40),
  phone_number VARCHAR(25),
  hire_date DATE,
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES department(id)
);


CREATE TABLE authorizing_officer (
  id SERIAL PRIMARY KEY,
  name VARCHAR(35),
  email VARCHAR(40),
  phone_number VARCHAR(25),
  department_id INTEGER,
  FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE claim(
    id serial primary key,
    claim_type varchar(20),
    transaction_date date,
    amount decimal(8,2),
    claim_description varchar(255),
    date_of_submission date,
    status varchar(16),
    employee_id integer,
    authorizing_officer_id integer,
    department_id integer,
    foreign key (employee_id) references employee(id),
    foreign key (authorizing_officer_id) references authorizing_officer(id),
    foreign key (department_id) references department(id)
);

CREATE TABLE file (
  id SERIAL PRIMARY KEY,
  file_name VARCHAR(255),
  created_at date,
  claim_id INTEGER,
  FOREIGN KEY (claim_id) REFERENCES claim(id)
);