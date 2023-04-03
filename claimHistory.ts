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
INNER JOIN department ON department.id = claim.department_id
ORDER BY claim.id DESC;`);
    //let dbEmployee = dbEmployeeList.rows[0];
    //console.log(dbEmployee);
    console.log(claimList.rows);
    res.json(claimList.rows);
  });

  historyRouter.post("/claimSearch", async (req, res) => {
    
    let search = req.body.search;
    let query = req.body.query;
    console.log("search: ", search ,query)
    let searchList = await client.query(`
    SELECT claim.id, department.name AS department_name, employee.name AS employee_name, claim.claim_type, claim.amount, claim.date_of_submission, claim.status
FROM claim
INNER JOIN employee ON employee.id = claim.employee_id
INNER JOIN department ON department.id = claim.department_id
WHERE ${search} Like $1
ORDER BY claim.id DESC;`, [`%${query}%`] );
    //let dbEmployee = dbEmployeeList.rows[0];
    //console.log(dbEmployee);
   // console.log(searchList.rows);
    res.json(searchList.rows);
  });

  historyRouter.get("/claimOneRecord", async (req, res) => {

    const id = req.query.id;
  
      let claimList = await client.query(`
      SELECT claim.id, employee.name AS employee_name, department.name AS department_name, claim.claim_type, claim.amount, claim.date_of_submission, claim.status
FROM claim
INNER JOIN employee ON employee.id = claim.employee_id
INNER JOIN department ON department.id = claim.department_id
WHERE claim.id = $1
      ;`,[id]);
      //let dbEmployee = dbEmployeeList.rows[0];
      //console.log(dbEmployee);
 //     console.log(claimList.rows);
      res.json(claimList.rows);
    });

  historyRouter.get("/claimInfo", (req, res) => {
    res.redirect("./claimInfo.html");
  });

//  historyRouter.get("claimInfoData"), async(req, res) => {
//    let claimListData = await client.query`
//    
//    `
//  }