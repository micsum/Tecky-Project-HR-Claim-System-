import express, { Router } from "express";
//import expressSession from "express-session";
import { client } from "./db";
import { comparePassword } from "./hash";
import session from "express-session";

//import path from "path";

export let userRouter = Router();
userRouter.use(express.static("admin")); //middleware for html-form-post

//read the html and css file , sequence is matter, public guy watch public
userRouter.use(express.urlencoded()); //middleware for html-form-post
userRouter.use(express.json());

declare module "express-session" {
  export interface SessionData {
    user: {
      id: number;
      name: string;
      role: string;
      email: string;
      department_id: number;
    };
  }
}

export let sessionMiddleware = session({
  //for session saving or deliver session, no need user / admin login again, if new user : create session
  secret: Math.random().toString(36).slice(2),
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 1000 * 60 * 60, //1hr auto logout
  },
});
userRouter.use(sessionMiddleware);
//let dbResult = await client.query(
//    /*sql*/ `SELECT * FROM employee WHERE (email = $1 or name =$1) AND password = $2`,
//    [username, password]
//  );

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body; //login username(either email or name)
  let dbResult = await client.query(
    /*sql*/ `SELECT * FROM employee WHERE (email = $1 or name =$1)`,
    [username]
  );
  let dbUser = dbResult.rows[0]; // check the db user
  if (dbResult.rows.length === 1) {
    let dbPassword = dbUser.password;
    //console.log(await comparePassword(password, dbPassword)); //check hashpassword against with userinput
    if (await comparePassword(password, dbPassword)) {
      req.session.user = {
        id: dbUser.id,
        name: dbUser.name,
        role: dbUser.role,
        email: dbUser.email,
        department_id: dbUser.department_id,
      };
      if (dbUser.role === "admin") {
        res.json({ role: "admin" });
        console.log("req.session", req.session.user);
        //res.redirect("./admin.html");
      } else {
        res.json({ role: "user" });
        //res.redirect("./user.html");
      }
    } else {
      res.status(401);
      res.json({ Error: `Incorrect username/email/password` });
    }
  } else {
    res.status(401);
    res.json({ Error: `Incorrect username/email/password` });
  }
});

export function isAdmin( //check the session is Admin or not
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session.user?.role === `admin`) {
    next();
  } else {
    res.status(401);
    //res.json({});
    //console.log("user redirect in isadmin");
    res.redirect("/");
  }
}

export function isUser( //check the session is User or not
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session.user) {
    next();
  } else {
    res.status(401);
    //res.json({});
    //console.log("user redirect in isuser");
    res.redirect("/");
  }
}

//userRouter.get("/admin", isAdmin, (req, res) => {
//  res.redirect("admin.html");
//});
//userRouter.get("/user", isUser, (req, res) => {
//  res.redirect("/user.html");
//});

userRouter.post("/logout", (req, res) => {
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
