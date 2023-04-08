import express, { Router } from "express";
import { client } from "./db";
import { comparePassword, hashPassword } from "./hash";

export let forgotpwRouter = Router();

forgotpwRouter.use(express.urlencoded()); //middleware for html-form-post
forgotpwRouter.use(express.json());

forgotpwRouter.post("/forgotPw", (req, res) => {
  console.log("email", req.body.email);
});
