import  express, { Router } from "express";
import { client } from "./db";
import { sessionMiddleware } from "./login";
//import session from "express-session";

export let userDashRouter = Router();
userDashRouter.use(sessionMiddleware);

userDashRouter.use(express.static("protected")); //read the html and css file , sequence is matter, public guy watch public
userDashRouter.use(express.urlencoded({ extended: true })); //middleware for html-form-post
userDashRouter.use(express.json());

userDashRouter.get("/userDash", async (req, res) => {
  console.log("loginasuser")
    res.redirect("userdashtest2.html");
    //console.log(req.session.user?.id)
  });

  userDashRouter.get("/getuserdashtest", async (req, res) => {
    //console.log(req.session.user?.id)
    let dbChecking =  await client.query(
        /*sql*/ `SELECT employee.name, employee.role FROM employee WHERE employee.id=$1`,
        [req.session.user?.id]
      );
      let employeeList = dbChecking.rows[0]
      console.log("testettttt",employeeList)
    //console.log(employeeList.name)
      res.json(employeeList)
      
  });

  userDashRouter.post("/logout", (req, res) => {
    console.log("logout");
  
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
    });
    res.redirect("/");
    //res.json({});
    console.log("destroy:", req.session);
  });

  userDashRouter.get("/blocking",  async (req, res) => {
    //let dbEmployee = dbEmployeeList.rows[0];
    //console.log(dbEmployee);
    console.log(req.session.user?.role);
    res.json(req.session.user?.role);
  });