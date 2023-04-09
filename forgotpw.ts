import express, { Router } from "express";
import { client } from "./db";
//import { comparePassword, hashPassword } from "./hash";
import { forgotPwEmail } from "./sendEmail";
import jwt from "jsonwebtoken";

export let forgotpwRouter = Router();

forgotpwRouter.use(express.static("public"));
forgotpwRouter.use(express.urlencoded()); //middleware for html-form-post
forgotpwRouter.use(express.json());

let employeeId: string;
let employeePw: string;
let employeeEmail: string;
const JWT_SECRET = "ResetPASSSSSSSSSSword";

forgotpwRouter.post("/forgotPw", async (req, res) => {
  //console.log("email", req.body.reqEmail);
  let requestEmail = req.body.reqEmail;
  const dbChecking = await client.query(
    /*sql*/ `SELECT email, name, id, password FROM employee WHERE email=$1`,
    [requestEmail]
  );
  if (dbChecking.rows.length != 1) {
    //console.log("Invalid Email");
    res.json({ error: "Invalid Email. Please try again." });
  } else {
    const employeeName = dbChecking.rows[0].name;
    employeeId = dbChecking.rows[0].id;
    employeePw = dbChecking.rows[0].password;
    employeeEmail = dbChecking.rows[0].email;
    // console.log(employeeName);

    const secret = JWT_SECRET + employeePw;
    const payload = {
      email: employeeEmail,
      id: employeeId,
    };
    const token = jwt.sign(payload, secret, { expiresIn: "10m" });
    const link = `http://localhost:8000/forgotpw/${employeeId}/${token}`;
    //console.log("link",link);
    forgotPwEmail(employeeEmail, employeeName, link);
    res.json({ emailStatus: "matchedWithDb" });
  }
});

forgotpwRouter.get("/forgotpw/:id/:token", (req, res) => {
  const { id, token } = req.params;

  if (id != employeeId) {
    res.json({ error: "Invalid id" });
    return;
  }
  const secret = JWT_SECRET + employeePw;
  try {
    //@ts-ignore
    const payload = jwt.verify(token, secret);
    res.sendFile("./resetpw.html");
  } catch (error) {
    console.error(error);
    res.send(error);
  }
});
