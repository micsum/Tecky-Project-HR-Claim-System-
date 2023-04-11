import express from "express";
import path from "path";
import { createClaim } from "./create_claim";
import { isAdmin, userRouter } from "./login";
import { registerRouter } from "./register";
import { passwordRouter } from "./changePassword";
import { profileRouter } from "./profile";
import { historyRouter } from "./claimHistory";
import { userHistoryRouter } from "./userHistory";
// import { sessionMiddleware } from "./login";
import { emailRouter } from "./sendEmail";
import { userDashRouter } from "./userDash";
import { chartRouter } from "./chart";
import { forgotpwRouter } from "./forgotpw";
import { isUser } from "./loginGuard";
import session from "express-session";


export const app = express();

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

let sessionMiddleware = session({
  //for session saving or deliver session, no need user / admin login again, if new user : create session
  secret: Math.random().toString(36).slice(2),
  saveUninitialized: true,
  resave: true,
  cookie: {
    maxAge: 1000 * 60 * 60, //1hr auto logout
  },
});

app.use(sessionMiddleware);
app.use(express.json());

app.use(forgotpwRouter);
app.use(userRouter);

app.use(userDashRouter);
app.use(passwordRouter);

app.use(chartRouter);
app.use(createClaim);
app.use(emailRouter);

app.use(profileRouter);

app.use(historyRouter);
app.use(express.static("public"));

app.use(isUser,userHistoryRouter);
app.use(isAdmin, registerRouter);
app.use(isUser, express.static("protected"));
// app.use(express.static("admin"));

//read the html and css file , sequence is matter, admin/user read the private
//app.use(createClaim);

app.use((req, res) => {
  res.status(404);
  res.sendFile(path.resolve("public", "404.html"));
});

let PORT = 8000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
