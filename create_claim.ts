import fs from "fs";
import formidable from "formidable";
import path from "path";
import express, { Router } from "express";
//import pg from "pg";
//import dotenv from "dotenv";
import { join } from "path";
import { client } from "./db";
//import { isUser } from "./login";
import expressSession from "express-session";

export let createClaim = Router();
declare module "express-session" {
  interface SessionData {
    user: {
      id: number;
      name: string;
      role: string;
      email: string;
      department_id: number;
    };
  }
}

//dotenv.config();
//const client = new pg.Client({
//  database: process.env.DB_NAME,
//  user: process.env.DB_USERNAME,
//  password: process.env.DB_PASSWORD,
//});
//
//client.connect(); using db.ts
createClaim.use(express.static("protected"));
createClaim.use(express.json());
createClaim.use(
  //for session saving or deliver session, no need user / admin login again, if new user : create session
  expressSession({
    secret: Math.random().toString(36).slice(2),
    saveUninitialized: true,
    resave: true,
    cookie: {
      maxAge: 1000 * 60 * 60, //1hr auto logout
    },
  })
);
createClaim.get("/getEmployee", async (req, res) => {
  let dbEmployeeList = await client.query(
    /*sql*/ `SELECT name, email, phone_number,department_id FROM employee WHERE employee.id=$1`,
    [req.session.user?.id]
  );
  let dbEmployee = dbEmployeeList.rows[0];
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

    await client.query(
      /*sql*/ `INSERT INTO claim(claim_type, transaction_date, amount, claim_description, date_of_submission, status, employee_id, department_id) VALUES($1,$2.$3.$4,NOW()::timestamp,$6,$7,$8)`,
      [
        claimTypeVal,
        tranDate,
        amount,
        claimDesVal,
        status,
        //(x = employeeid), //add after
        //(y = departmentid), //add after
      ]
    );

    let attachMaybeArray = files.attachment;
    let attachment = Array.isArray(attachMaybeArray)
      ? attachMaybeArray[0]
      : attachMaybeArray;
    //@ts-ignore
    let filename = attachment?.newFilename;
    //console.log(filename);
    //let result = await client.query(/*sql*/ `SELECT * FROM file`);

    await client.query(
      /*sql*/ `INSERT INTO file(file_name,created_at) VALUES($1, NOW()::timestamp)`,
      [filename]
    );
  });

  res.json({ success: true });
});
