import fs from "fs";
import formidable from "formidable";
import path from "path";
import express, { Router } from "express";
//import pg from "pg";
//import dotenv from "dotenv";
import { join } from "path";
import { client } from "./db";
export let attachRouter = Router();

//dotenv.config();
//const client = new pg.Client({
//  database: process.env.DB_NAME,
//  user: process.env.DB_USERNAME,
//  password: process.env.DB_PASSWORD,
//});
//
//client.connect(); using db.ts
attachRouter.use(express.json());
let uploadDir = join("uploads", "attachment");
attachRouter.use("uploads/attachment", express.static(uploadDir));

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

attachRouter.post("/attachment", (req, res) => {
  attach.parse(req, async (err, fields, files) => {
    console.log("files:", files);

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
