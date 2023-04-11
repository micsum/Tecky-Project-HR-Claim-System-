import express, { Router } from "express";
import { client } from "./db";
//import { comparePassword, hashPassword } from "./hash";
import { forgotPwEmail } from "./sendEmail";
import jwt from "jsonwebtoken";
import { hashPassword } from "./hash";

export let forgotpwRouter = Router();

// let employeeId: string;
// let employeePw: string;
// let employeeEmail: string;
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
    let employeeId = dbChecking.rows[0].id;
    // let employeePw = dbChecking.rows[0].password;
    let employeeEmail = dbChecking.rows[0].email;
    // console.log(employeeName);

    const secret = JWT_SECRET;
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

function authenticate(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  
  // const secret = JWT_SECRET + employeePw;
  try {
    const { id, token } = req.params;
    console.log(token);
    
  
    let decoded = jwt.verify(token, JWT_SECRET) as {id: string, email:string};
  
    if (id != decoded.id) {
      res.json({ error: "Invalid id" });
      return;
    }

    // console.log("middleware next ed");

    //@ts-ignore
    // const payload = jwt.verify(token, secret);
    next();
  } catch (error) {
    console.error(error);
    res.send(error);
  }
}

forgotpwRouter.get("/forgotpw/:id/:token", authenticate, (req, res) => {
  res.sendFile(__dirname + "/protected/" + "resetpw.html");
});

forgotpwRouter.post("/resetpw", async (req, res) => {
  //const id = req.params.id;
  //
  //const token = req.params.token;
  const { email, password, password2, jwt } = req.body;
  //console.log("email", email);
  //console.log("password", password);
  //console.log("password2", password2);

  console.log(jwt);

  let decoded = jwt.verify(jwt, JWT_SECRET) as {id: string, email:string};
  console.log(decoded);
  
  
  const dbChecking = await client.query(
    /*sql*/ `SELECT email, password FROM employee WHERE email=$1`,
    [email]
  );

  if (dbChecking.rows.length != 1) {
    res.json({ error1: "Invalid Email" });
  }

  if (password != password2) {
    res.json({ error2: "Both passwords are not identical. Please correct." });
  }

  if (password.length < 6) {
    res.json({
      error3: "Please input the password with more than 6 characters",
    });
  }

  if (password === password2) {
    let newHashPassword = await hashPassword(password2);

    await client.query(
      /*sql*/ `UPDATE employee SET password = $1 WHERE email = $2`,
      [newHashPassword, email]
    );
    res.json({ success: "Password has been reset" });
  }
});
