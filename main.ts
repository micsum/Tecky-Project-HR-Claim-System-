import express from "express";
import path from "path";
import { createClaim } from "./create_claim";
import { isAdmin, isUser, userRouter } from "./login";
import { registerRouter } from "./register";
import { passwordRouter } from "./changePassword";
import { profileRouter } from "./profile";
import { historyRouter } from "./claimHistory";
import { userHistoryRouter } from "./userHistory";
import { sessionMiddleware } from "./login";
import { emailRouter } from "./sendEmail";
import { userDashRouter } from "./userDash";
import { chartRouter } from "./chart";
export const app = express();
app.use(express.static("public"));
app.use(express.json());
app.use(userRouter);
app.use(sessionMiddleware);
app.use(isUser, express.static("protected"));
//app.use(isAdmin, express.static("protected"));

//app.use(express.static("protected"));

app.use(userDashRouter);
app.use(passwordRouter);

app.use(chartRouter);
app.use(createClaim);
app.use(emailRouter);

app.use(profileRouter);
app.use(userHistoryRouter);


//app.use(isUser, express.static("user"));
app.use(isAdmin, historyRouter);
app.use(isAdmin, registerRouter);


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
