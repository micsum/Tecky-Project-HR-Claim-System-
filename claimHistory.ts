import express, { Router } from "express";
import { uploadDir } from "./create_claim";
import { client } from "./db";
import { statusEmail } from "./sendEmail";
import { sessionMiddleware } from "./login";

//import expressSession from "express-session";

export let historyRouter = Router();

historyRouter.use(sessionMiddleware);
historyRouter.use(express.static("protected"));
historyRouter.use("/uploads", express.static(uploadDir));
historyRouter.use(express.json());

historyRouter.get("/claimHistory", (req, res) => {
  res.redirect("./claimHistorytest2.html");
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

let email: string,
  employeeName: string,
  claimId: number,
  claimTypeText: string,
  amount: number,
  claimEmployeeId: number;

historyRouter.post("/claimInfo", async (req, res) => {
  const id = req.query.id;
  //console.log("claimID1", id);
  let selectedClaimInfo = await client.query(
    /*sql*/ `
      SELECT  employee.phone_number AS employee_phoneNumber, employee.email AS email, employee.name AS employee_name, 
      department.name AS department_name, 
      claim.id as claim_id,claim.claim_type, claim.amount, claim.transaction_date, claim.status, claim.claim_description, claim.employee_id as claim_employee_id,
      reject.reasons AS reject_reasons
      FROM claim 
      INNER JOIN employee ON employee.id = claim.employee_id
      INNER JOIN department ON department.id = claim.department_id
      LEFT JOIN reject on reject.claim_id = claim.id
      WHERE claim.id = $1
      ;`,
    [id]
  );
  //let dbEmployee = dbEmployeeList.rows[0];
  //console.log(dbEmployee);
  //console.log("selected claimid", selectedClaimInfo.rows[0]);
  email = selectedClaimInfo.rows[0].email;
  employeeName = selectedClaimInfo.rows[0].employee_name;
  claimId = selectedClaimInfo.rows[0].claim_id;
  claimTypeText = selectedClaimInfo.rows[0].claim_type;
  amount = selectedClaimInfo.rows[0].amount;
  claimEmployeeId = selectedClaimInfo.rows[0].claim_employee_id;
  res.json(selectedClaimInfo.rows[0]);
});

historyRouter.get("/claimInfo", (req, res) => {
  res.redirect("./claimInfo.html");
});

historyRouter.post("/claimInfo/:id", async (req, res) => {
  const id = req.params.id;
  const userId = req.session.user?.id;
  if (userId === claimEmployeeId) {
    res.json({ adminId: "sameAdminId" });
    return;
  }
  if (req.body.status === "approved") {
    //console.log("claimId2", +id); //check query id
    let statusA = await client.query(
      /*sql*/ `
    UPDATE claim SET status = 'Approved' WHERE claim.id=$1 RETURNING status;`,
      [id]
    );
    //console.log("status", statusA.rows[0].status);
    const approved = statusA.rows[0].status;
    statusEmail(email, employeeName, claimId, claimTypeText, amount, approved);
    res.json({ status: "claim approved" });
  } else {
    let reasons = req.body.rejectReasons;
    let statusR = await client.query(
      /*sql*/ `
  UPDATE claim SET status = 'Rejected' WHERE claim.id=$1 RETURNING status;`,
      [id]
    );
    const rejected = statusR.rows[0].status;
    statusEmail(email, employeeName, claimId, claimTypeText, amount, rejected);
    const reject = await client.query(
      /*sql*/ `
  INSERT INTO reject(reasons, claim_id, reject_date) VALUES($1,$2,NOW()::date)RETURNING id`,
      [reasons, id]
    );
    const rejectId = reject.rows[0].id;
    res.json({ status: "claim rejected", rejectId: rejectId });
  }
});
//  historyRouter.get("claimInfoData"), async(req, res) => {
//    let claimListData = await client.query`
//
//    `
//  }
