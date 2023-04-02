import  express, { Router } from "express";
import { client } from "./db";
//import expressSession from "express-session";

export let profileRouter = Router()

profileRouter.use(express.static("protected")); //read the html and css file , sequence is matter, public guy watch public
profileRouter.use(express.urlencoded({ extended: true })); //middleware for html-form-post
profileRouter.use(express.json());

profileRouter.get("/profile", async (req, res) => {
    res.redirect("profile.html");
    //console.log(req.session.user?.id)
  });

  profileRouter.get("/getProfile", async (req, res) => {
    //console.log(req.session.user?.id)
    let dbChecking =  await client.query(
        /*sql*/ `SELECT department.id, department.name, employee.id,employee.name, employee.email, employee.role, employee.phone_number,employee.department_id, department.name as department_name FROM employee join department on department.id = employee.department_id WHERE employee.id=$1`,
        [req.session.user?.id]
      );
      let employeeList = dbChecking.rows[0]
      console.log(employeeList)
    //console.log(employeeList.name)
      res.json(employeeList)
      
  });