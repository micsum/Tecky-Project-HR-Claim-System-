import express, { Router } from "express";
import expressSession from "express-session";
export let userRouter = Router();

userRouter.use(express.static("public")); //read the html and css file , sequence is matter, public guy watch public
userRouter.use(express.urlencoded()); //middleware for html-form-post

//type User = {
//username: string;
//password: string;
//};

userRouter.use(
  //for session saving, no need user / admin login again
  expressSession({
    secret: Math.random().toString(36).slice(2),
    saveUninitialized: true,
    resave: true,
  })
);

userRouter.post("/login", (req, res) => {
  //logic for frontend login and check is Admin or User or Invalid
  if (req.body.username === `admin` && req.body.password === `1234`) {
    req.session["isAdmin"] = true;
    req.session.save();
    console.log(req.session);
    res.redirect("/admin.html");
  } else if (req.body.username === "user" && req.body.password === "1234") {
    req.session["isUser"] = true;
    req.session.save();
    console.log(req.session);
    res.redirect("/user.html");
  } else {
    res.status(403);
    res.send("Invalid Username / Password");
  }
});

function isAdmin( //check the session is Admin or not
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session["isAdmin"]) {
    next();
  } else {
    res.status(401);
    res.redirect("/");
  }
}

function isUser( //check the session is User or not
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (req.session["isUser"]) {
    next();
  } else {
    res.status(401);
    res.redirect("/");
  }
}

userRouter.get("/admin", isAdmin, (req, res) => {
  res.redirect("/admin.html");
});

userRouter.get("/user", isUser, (req, res) => {
  res.redirect("/user.html");
});

userRouter.use(isAdmin, express.static("private")); //read the html and css file , sequence is matter, admin/user read the private
userRouter.use(isUser, express.static("private"));

userRouter.post("/logout", (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
    console.log(req.session);
  });
});
