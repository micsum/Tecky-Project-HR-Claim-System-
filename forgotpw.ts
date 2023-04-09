import express, { Router } from "express";
import { client } from "./db";
//import { comparePassword, hashPassword } from "./hash";
import { forgotPwEmail } from "./sendEmail";
export let forgotpwRouter = Router();

forgotpwRouter.use(express.static("public"));
forgotpwRouter.use(express.urlencoded()); //middleware for html-form-post
forgotpwRouter.use(express.json());

forgotpwRouter.post("/forgotPw", async (req, res) => {
  //console.log("email", req.body.reqEmail);
  let employeeEmail = req.body.reqEmail;
  const dbChecking = await client.query(
    /*sql*/ `SELECT email, name FROM employee WHERE email=$1`,
    [employeeEmail]
  );
  if (dbChecking.rows.length != 1) {
    //console.log("Invalid Email");
    res.json({ error: "Invalid Email. Please try again." });
  } else {
    const employeeName = dbChecking.rows[0].name;
    // console.log(employeeName);
    forgotPwEmail(employeeEmail, employeeName);
    res.json({ emailStatus: "matchedWithDb" });
  }
});
