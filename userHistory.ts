import express, { Router } from "express";
import { client } from "./db";
//import session from "express-session";

export let userHistoryRouter = Router();

userHistoryRouter.use(express.static("protected"));
userHistoryRouter.use(express.json());

userHistoryRouter.get("/userHistory", (req, res) => {
  res.redirect("./userHistorytest2.html");
});

userHistoryRouter.get("/userRecord", async (req, res) => {
  let claimList = await client.query(
    `
    SELECT claim.id, department.name AS department_name, employee.name AS employee_name, claim.claim_type, claim.amount, claim.date_of_submission, claim.status
    FROM claim
    INNER JOIN employee ON employee.id = claim.employee_id
    INNER JOIN department ON department.id = claim.department_id
    WHERE employee.id = $1
    ORDER BY claim.id DESC
    `,
    [req.session.user?.id]
  );
  //let dbEmployee = dbEmployeeList.rows[0];
  //console.log(dbEmployee);
  console.log(claimList.rows);
  res.json(claimList.rows);
});

userHistoryRouter.get("/claimOneRecord", async (req, res) => {
  const id = req.query.id;

  let claimList = await client.query(
    `
      SELECT *
      FROM claim
      INNER JOIN employee ON employee.id = claim.employee_id
      INNER JOIN department ON department.id = claim.department_id
      WHERE claim.id = $1
      ;`,
    [id]
  );
  //let dbEmployee = dbEmployeeList.rows[0];
  //console.log(dbEmployee);
  console.log(claimList.rows);
  res.json(claimList.rows);
});

// userHistoryRouter.post("/claimInfo", async (req, res) => {
//     const id = req.query.id;
//     //console.log("claimID1", id);
//     let selectedClaimInfo = await client.query(
//       /*sql*/ `
//         SELECT  employee.phone_number AS employee_phoneNumber, employee.email AS email, employee.name AS employee_name,
//         department.name AS department_name,
//         claim.id as claim_id,claim.claim_type, claim.amount, claim.transaction_date, claim.status, claim.claim_description
//         FROM claim
//         INNER JOIN employee ON employee.id = claim.employee_id
//         INNER JOIN department ON department.id = claim.department_id
//         WHERE claim.id = $1
//         ;`,
//       [id]
//     );
//     //let dbEmployee = dbEmployeeList.rows[0];
//     //console.log(dbEmployee);
//     //console.log("selected claimid", selectedClaimInfo.rows[0]);
//     res.json(selectedClaimInfo.rows[0]);
//   });
//    userHistoryRouter.get("/claimInfo", (req, res) => {
//    res.redirect("./claimInfo.html");
//  })
//  historyRouter.get("claimInfoData"), async(req, res) => {
//    let claimListData = await client.query`
//
//    `
//  }

userHistoryRouter.post("/logout", (req, res) => {
  console.log("logout");

  req.session.destroy((err) => {
    if (err) {
      console.log(err);
    }
  });
  res.redirect("/");
  //res.json({});
  console.log("destroy:", req.session);
});

userHistoryRouter.get("/blocking", async (req, res) => {
  //let dbEmployee = dbEmployeeList.rows[0];
  //console.log(dbEmployee);
  console.log(req.session.user?.role);
  res.json(req.session.user?.role);
});
