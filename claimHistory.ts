import  express, { Router } from "express";
import { client } from "./db";
//import expressSession from "express-session";

export let historyRouter = Router();

historyRouter.use(express.static("protected"));
historyRouter.use(express.json());

historyRouter.get("/claimHistory", (req, res) => {
    res.redirect("./claimHistory.html");
  });

historyRouter.get("/claimRecord", async (req, res) => {
    let claimList = await client.query(`
    SELECT claim.id, department.name AS department_name, employee.name AS employee_name, claim.claim_type, claim.amount, claim.date_of_submission, claim.status
    FROM claim
    INNER JOIN employee ON employee.id = claim.employee_id
    INNER JOIN department ON department.id = claim.department_id;
        `
    );
    //let dbEmployee = dbEmployeeList.rows[0];
    //console.log(dbEmployee);
    console.log(claimList.rows);
    res.json(claimList.rows);
  });

  historyRouter.get("/claimInfo", (req, res) => {
    res.redirect("./claimInfo.html");
  });