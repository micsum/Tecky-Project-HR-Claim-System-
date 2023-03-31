import express, { Router } from "express";
//import path from "path";
//import { stringify } from "querystring";
import { client } from "./db";
import { hashPassword } from "./hash";
import { isAdmin } from "./login";
//import expressSession from "express-session";
export let registerRouter = Router();

registerRouter.use(express.static("protected")); //read the html and css file , sequence is matter, public guy watch public
registerRouter.use(express.urlencoded({ extended: true })); //middleware for html-form-post
registerRouter.use(express.json());
registerRouter.get("/adduser", isAdmin, (req, res) => {
  res.redirect("adduser.html");
});

//registerRouter.post('/adduser', (req,res) => {
//    console.log('hi: ', req.body)
//    let employeeName = req.body.employeeName;
//    let email = req.body.email;
//    let password = req.body.password;
//    let phoneNumber = req.body.phoneNumber;
//    let role = req.body.role;
//    let hireDate = req.body.hireDate;
//    let departmentId = req.body.departmentId;
//    console.log(employeeName, email, password, phoneNumber, role, hireDate, departmentId)
//})

registerRouter.post("/addDepartment", async (req, res) => {
  let department_id = req.body.id;
  let department_name = req.body.name;
  await client.query(
    /*sql*/ `INSERT INTO department (id, name) values ($1,$2)
  `,
    [department_id, department_name]
  );
});
registerRouter.get("/getDepartment", async (req, res) => {
  let dbDepartment = await client.query(/*sql*/ `SELECT name FROM department`);
  let dbDepartmentName = dbDepartment.rows;
  //console.log(dbDepartmentName); test fetch work or not
  res.json(dbDepartmentName);
});

registerRouter.post("/adduser", async (req, res) => {
  console.log("hi: ", req.body);
  let employeeName = req.body.employeeName;
  let email = req.body.email;
  let password = req.body.password;
  let phoneNumber = req.body.phoneNumber;
  let role = req.body.role;
  let hireDate = req.body.hireDate;
  let departmentId = req.body.departmentId;
  console.log(
    employeeName,
    email,
    password,
    phoneNumber,
    role,
    hireDate,
    departmentId
  );

  async function insertQuery() {
    if (employeeName.length < 2) {
      console.log("invalid Employee Name");
      res.json({ error: "invalid Employee Name" });
      return;
    }
    let dbResult = await client.query(/*sql*/ `SELECT * FROM employee`);
    console.log(dbResult);
    let dbUser = dbResult.rows[0];
    if (dbUser.name === employeeName) {
      res.json({ error: "Duplicate Registered User Name" });
    } //check duplicate user name
    else if (dbUser.email === email) {
      res.json({ error: "Duplicate Registered email" });
    } else if (dbUser.phone_number === phoneNumber) {
      res.json({ error: "Duplicate Registered Phone No." });
    }

    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email) === false) {
      console.log("invalid email");
      res.json({ error: "invalid email" });
      return;
    }

    if (password.length < 6) {
      console.log("invalid password");
      res.json({ error: "invalid password" });
      return;
    }
    if (phoneNumber.length < 8) {
      console.log("invalid Phone Number");
      res.json({ error: "invalid Phone Number" });
      return;
    }
    if (departmentId.length < 0) {
      console.log("invalid Department Info");
      res.json({ error: "invalid Department Info" });
      return;
    }

    let result = await hashPassword(password); //changed to basic hash
    console.log(result);

    await client.query(
      `
        insert into employee (name, email, password, phone_number, role, hire_date, department_id) values ($1,$2,$3,$4,$5,$6,$7)
        `,
      [employeeName, email, result, phoneNumber, role, hireDate, departmentId]
    );
    res.json({ error: "" });

    await client.end();
    console.log("done");
  }
  insertQuery();
});
