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

export let createClaim = Router();

createClaim.use(sessionMiddleware);
createClaim.use(express.static("protected"));
createClaim.use(express.json());
createClaim.use(sessionMiddleware);

createClaim.get("/getEmployee", async (req, res) => {
  let dbEmployeeList = await client.query(
    /*sql*/ `SELECT employee.id,employee.name, employee.email, employee.phone_number,employee.department_id, department.name as department_name FROM employee join department on department.id = employee.department_id WHERE employee.id=$1`,
    [req.session.user?.id]
  );
  let dbEmployee = dbEmployeeList.rows[0];
  //console.log(dbEmployee);
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

    let claimTypeVal = fields.type;
    let claimDesVal = fields.claim_description;
    let tranDate = fields.t_date;
    let amount = fields.amount;
    let status = fields.claim_status;
    let employee_id = fields.employeeDbId;
    let department_id = fields.departmentDbId;

    await client.query(
      /*sql*/ `INSERT INTO claim(claim_type, transaction_date, amount, claim_description, date_of_submission, status, employee_id, department_id) VALUES($1,$2,$3,$4,NOW()::timestamp,$5,$6,$7)`,
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
  });

  attach.parse(req, async (err, fields, files) => {
    let attachMaybeArray = files.attachment;
    let attachment = Array.isArray(attachMaybeArray)
      ? attachMaybeArray[0]
      : attachMaybeArray;
    //@ts-ignore
    let filename = attachment?.newFilename;
    //console.log(filename);
    //let result = await client.query(/*sql*/ `SELECT * FROM file`);
    await client.query(/*sql*/ ` SELECT id FROM claim`);
    await client.query(
      /*sql*/ `INSERT INTO file(file_name,created_at,claim_id) VALUES($1, NOW()::timestamp,$2)`,
      [filename] // how to create the claim id??
    );
  });

  res.json({ success: true });
});
