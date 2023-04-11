import { Router } from "express";
// import path from "path";
import { client } from "./db";
import { comparePassword, hashPassword } from "./hash";

export let passwordRouter = Router();

// passwordRouter.get("/changepassword", (req, res) => {
//   res.sendFile(path.resolve("protected", "changepassword.html"));
// });

passwordRouter.post("/changepassword", async (req, res) => {
  //console.log('hi: ', req.body)
  let employeeName = req.body.employeeName;
  let email = req.body.email;
  let currentPassword = req.body.currentPassword;
  let newPassword = req.body.newPassword;
  let rePassword = req.body.rePassword;
  //console.log(employeeName, email, currentPassword, newPassword, rePassword);
  //res.sendFile(path.resolve("protected","changepassword.html"))

  if (newPassword.length < 6) {
    console.log("invalid new Password");
    res.json({ error: "invalid new Password" });
    return;
  }
  if (rePassword.length < 6) {
    console.log("Re-type Password failed");
    res.json({ error: "Re-type Password failed" });
    return;
  }
  if (rePassword != newPassword) {
    console.log("2 New Password Inputs should be Equal");
    res.json({ error: "2 New Password Inputs should be Equal" });
    return;
  }
  //try{
  //     await client.query(
  //        `
  //        SELECT * FROM employee
  //        WHERE name = $1 AND email = $2;
  //          `,
  //        [employeeName, email]
  //      );
  //    } catch {
  //        console.log("Incorrect Current Password");
  //        res.json({ error: "Incorrect Current Password" });
  //    }
  let dbChecking = await client.query(
    `
        SELECT * FROM employee
        WHERE name = $1 AND email = $2;
          `,
    [employeeName, email]
  );
  //console.log(dbChecking)
  if (dbChecking.rows.length != 1) {
    console.log("Incorrect Employee Name or Email");
    res.json({ error: "Incorrect Employee Name or Email" });
    return;
  }

  if ((dbChecking.rows.length === 1)) {
    let dbRow = dbChecking.rows[0];
    console.log(dbRow.password);

    if (await comparePassword(currentPassword, dbRow.password)) {
      let newHashPassword = await hashPassword(newPassword);
      await client.query(
        `
                UPDATE employee
    SET password = $1
    WHERE name = $2 AND email = $3;
                `,
        [newHashPassword, employeeName, email]
      );
      console.log("ok: ", newPassword);
      console.log("hashed: ", newHashPassword);
      res.json({ error: "Success" });
    }
    else {
      res.json({ error: "Incorrect Current Password" });
    }

    // if (!(await comparePassword(currentPassword, dbRow.password))) {
    //   res.json({ error: "Incorrect Current Password" });
    // }

  }
});

// passwordRouter.post("/logout", (req, res) => {
//   console.log("logout");

//   req.session.destroy((err) => {
//     if (err) {
//       console.log(err);
//     }
    
//   });
//   console.log("destroy:", req.session);
//   res.redirect("/");
  
//   //res.json({});
// });
