import express, { Router } from "express";
import expressSession from "express-session";
import { client } from "./db";
//import path from "path";
export let userRouter = Router();

//read the html and css file , sequence is matter, public guy watch public
userRouter.use(express.urlencoded()); //middleware for html-form-post

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

userRouter.use(
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

userRouter.post("/login", async (req, res) => {
  const { username, password } = req.body; //login username(either email or name)

  let dbResult = await client.query(
    /*sql*/ `SELECT * FROM employee WHERE (email = $1 or name =$1) AND password = $2`,
    [username, password]
  );
  let user = dbResult.rows[0]; // check the db user
  if (dbResult.rows.length === 1) {
    req.session.user = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      department_id: user.department_id,
    };
    //console.log("req.session.user", req.session.user);
    if (req.session.user.role === "user") {
      res.redirect("/user.html");
    } else if (req.session.user.role === "admin") {
      res.redirect("/admin.html");
    }
  } else {
    res.status(401);
    res.json({ Error: `Incorrect username or email,password` });
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
    res.redirect("/");
  }
}

export function isUser( //check the session is User or not
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session.user?.role === `user`) {
    next();
  } else {
    res.status(401);
    //res.json({});
    res.redirect("/");
  }
}

userRouter.get("/admin", isAdmin, (req, res) => {
  res.redirect("admin.html");
});

userRouter.get("/user", isUser, (req, res) => {
  res.redirect("user.html");
});

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
