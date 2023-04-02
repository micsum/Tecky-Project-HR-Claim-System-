import fs from "fs";
import formidable from "formidable";
import path from "path";
import express, { Router } from "express";
//import pg from "pg";
//import dotenv from "dotenv";
import { join } from "path";
import { client } from "./db";
//import { isUser } from "./login";
import { sessionMiddleware } from "./login";
import { sendClaimEmail } from "./sendEmail";

export let createClaim = Router();

createClaim.use(sessionMiddleware);
createClaim.use(express.static("protected"));
createClaim.use(express.json());
createClaim.use(sessionMiddleware);

createClaim.get("/create_claim", (req, res) => {
  res.redirect("./create_claim.html");
});

createClaim.get("/getEmployee", async (req, res) => {
  let dbEmployeeList = await client.query(
    /*sql*/ `SELECT employee.id,employee.name, employee.email, employee.phone_number,employee.department_id, department.name as department_name FROM employee join department on department.id = employee.department_id WHERE employee.id=$1`,
    [req.session.user?.id]
  );
  let dbEmployee = dbEmployeeList.rows[0];
  console.log("dbEmployee", dbEmployee);
  res.json(dbEmployee);
});

let uploadDir = join("uploads", "attachment");
createClaim.use("uploads/attachment", express.static(uploadDir));

fs.mkdirSync(path.join(__dirname, uploadDir), { recursive: true });
let attach = formidable({
  uploadDir,
  keepExtensions: true,
  //multiples: true,
  maxFiles: 5,
  maxFieldsSize: 5 * 1024 * 1024,
  filter: (part) =>
    part.mimetype?.startsWith("image/") ||
    part.mimetype?.startsWith("application/pdf") || //unknown work or not
    false,
});

createClaim.post("/create_claim", (req, res) => {
  attach.parse(req, async (err, fields, files) => {
    //console.log("files:", files);
    console.log("fields", fields);
    function checkArray(x: any | any[]) {
      x = Array.isArray(x) ? x[0] : x;
      return x;
    }
    let employeeName = checkArray(fields.employeeName);
    let claimTypeVal = checkArray(fields.type);
    let claimDesVal = checkArray(fields.claim_description);
    let tranDate = checkArray(fields.t_date);
    let amount = checkArray(fields.amount);
    let status = checkArray(fields.claim_status);
    let employee_id = checkArray(fields.employeeDbId);
    let department_id = checkArray(fields.departmentDbId);
    let email = checkArray(fields.email);
    let claimTypeText = checkArray(fields.claimTypeText);
    const result = await client.query(
      /*sql*/ `INSERT INTO claim(claim_type, transaction_date, amount, claim_description, date_of_submission, status, employee_id, department_id) VALUES($1,$2,$3,$4,NOW()::timestamp,$5,$6,$7)RETURNING id`,
      [
        claimTypeVal,
        tranDate,
        amount,
        claimDesVal,
        status,
        employee_id,
        department_id,
      ]
    );
    const claimId = result.rows[0].id;
    let attachMaybeArray = files.attachment;
    let attachment = Array.isArray(attachMaybeArray)
      ? attachMaybeArray[0]
      : attachMaybeArray;
    //@ts-ignore
    let filename = attachment?.newFilename;
    //console.log(filename);
    await client.query(
      /*sql*/ `INSERT INTO file(file_name,created_at,claim_id) VALUES($1, NOW()::timestamp,$2)`,
      [filename, claimId] // how to create the claim id??
    );

    sendClaimEmail(
      email,
      employeeName,
      claimId,
      claimTypeText,
      claimDesVal,
      amount
    );
    res.json({ success: true });
  });
});
