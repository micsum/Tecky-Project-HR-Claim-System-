CREATE DATABASE wsp_group_project;

CREATE TABLE file
(
  id        SERIAL        NOT NULL,
  file_name VARCHAR (255) NOT NULL,
  created_at TIMESTAMP    NOT NULL,
  PRIMARY KEY (id)
);

CREATE TABLE employee
(
id	serial unique PRIMARY KEY,               
name	varchar(35),	                              
email	varchar(40),                              
phone_number	varchar(25),	                        
hire_date	date,
FOREIGN KEY department_id	integer FK -- department.id
)



authorizing_officer
--------------------------
id serial unique	PK
name	varchar(35)	
email	varchar(35)	
phone_number varchar(25)	
department_id FK -- department.id 	

department
-------------------------
id serial PK	unique 
name	varchar(20)	

claim
-----------------------------------------------------------
id serial	PK unique 
claim_type varchar(20)
transaction_date date
amount decimal (8,2) 	
claim_description	varchar(100)
date_of_submission date
status	varchar(16)
employee_id	integer FK >- employee.id
authorizing_officer_id	integer	FK >- authorizing_officer.id

claim_file
----------------------------------------------------
id serial	PK unique
file_name varchar(255)
claim_id integer FK >- claim.id


# claim (720, 365)
# employee (345, 42)
# authorizing_officer (356, 868)
# claim_file (1821, 305)
# department (38, 527)
# view: (-8, 86)