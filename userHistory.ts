import  express, { Router } from "express";
import { client } from "./db";
//import session from "express-session";

export let userHistoryRouter = Router();

userHistoryRouter.use(express.static("protected"));
userHistoryRouter.use(express.json());

userHistoryRouter.get("/userHistory", (req, res) => {
    res.redirect("./userHistory.html");
  });

  
  

  userHistoryRouter.get("/userRecord",  async (req, res) => {

    let claimList = await client.query(`
    SELECT claim.id, department.name AS department_name, employee.name AS employee_name, claim.claim_type, claim.amount, claim.date_of_submission, claim.status
    FROM claim
    INNER JOIN employee ON employee.id = claim.employee_id
    INNER JOIN department ON department.id = claim.department_id
    WHERE employee.id = $1
    ORDER BY claim.id DESC
    `,
    [req.session.user?.id]);
    //let dbEmployee = dbEmployeeList.rows[0];
    //console.log(dbEmployee);
    console.log(claimList.rows);
    res.json(claimList.rows);
  });

  userHistoryRouter.get("/claimOneRecord", async (req, res) => {

    const id = req.query.id;
  
      let claimList = await client.query(`
      SELECT *
      FROM claim
      INNER JOIN employee ON employee.id = claim.employee_id
      INNER JOIN department ON department.id = claim.department_id
      WHERE claim.id = $1
      ;`,[id]);
      //let dbEmployee = dbEmployeeList.rows[0];
      //console.log(dbEmployee);
      console.log(claimList.rows);
      res.json(claimList.rows);
    });

//    userHistoryRouter.get("/claimInfo", (req, res) => {
//    res.redirect("./claimInfo.html");
//  })
//  historyRouter.get("claimInfoData"), async(req, res) => {
//    let claimListData = await client.query`
//    
//    `
//  }