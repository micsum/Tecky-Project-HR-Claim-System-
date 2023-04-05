import express, { Router } from "express";
import { uploadDir } from "./create_claim";
import { client } from "./db";

//import expressSession from "express-session";

export let historyRouter = Router();

historyRouter.use(express.static("protected"));
historyRouter.use("/uploads", express.static(uploadDir));
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
  //console.log("claimList.rows", claimList.rows);
  res.json(claimList.rows);
});

historyRouter.post("/claimSearch", async (req, res) => {
  let search = req.body.search;
  let query = req.body.query;
  //console.log("search: ", search, "query", query);
  let searchList = await client.query(
    `
    SELECT claim.id, department.name AS department_name, employee.name AS employee_name, claim.claim_type, claim.amount, claim.date_of_submission, claim.status
FROM claim
INNER JOIN employee ON employee.id = claim.employee_id
INNER JOIN department ON department.id = claim.department_id
WHERE ${search} Like $1
ORDER BY claim.id DESC;`,
    [`%${query}%`]
  );
  //let dbEmployee = dbEmployeeList.rows[0];
  //console.log(dbEmployee);
  //console.log("searchList from db searched by query+search", searchList.rows);
  res.json(searchList.rows);
});

historyRouter.post("/claimInfo", async (req, res) => {
  const id = req.query.id;
  //console.log("claimID1", id);
  let selectedClaimInfo = await client.query(
    /*sql*/ `
      SELECT  employee.phone_number AS employee_phoneNumber, employee.email AS email, employee.name AS employee_name, 
      department.name AS department_name, 
      claim.id as claim_id,claim.claim_type, claim.amount, claim.transaction_date, claim.status, claim.claim_description 
      FROM claim 
      INNER JOIN employee ON employee.id = claim.employee_id
      INNER JOIN department ON department.id = claim.department_id
      WHERE claim.id = $1
      ;`,
    [id]
  );
  //let dbEmployee = dbEmployeeList.rows[0];
  //console.log(dbEmployee);
  //console.log("selected claimid", selectedClaimInfo.rows[0]);
  res.json(selectedClaimInfo.rows[0]);
});

historyRouter.get("/claimInfo", (req, res) => {
  res.redirect("./claimInfo.html");
});

historyRouter.post("/claimInfo/:id", async (req, res) => {
  const id = req.params.id;
  //console.log("claimId2", +id); //check query id
  if (req.body.status === "approved") {
    await client.query(
      /*sql*/ `
    UPDATE claim SET status = 'Approved' WHERE claim.id=$1;`,
      [id]
    );
    res.json({ status: "claim approved" });
  } else {
    await client.query(
      /*sql*/ `
  UPDATE claim SET status = 'Rejected' WHERE claim.id=$1;`,
      [id]
    );
    res.json({ status: "claim rejected" });
  }
});
//  historyRouter.get("claimInfoData"), async(req, res) => {
//    let claimListData = await client.query`
//
//    `
//  }
