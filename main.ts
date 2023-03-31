import express from "express";
import path from "path";
import { createClaim } from "./create_claim";
import { isAdmin, isUser, userRouter } from "./login";
import { registerRouter } from "./register";
import { passwordRouter } from "./changePassword";
import { sessionMiddleware } from "./login";
export const app = express();

app.use(sessionMiddleware);
app.use(express.static("public"));
//app.use(express.static("protected"));
app.use(express.json());
app.use(passwordRouter);
app.use(createClaim);
app.use(userRouter);
app.use(isUser, express.static("user"));
app.use(isAdmin, registerRouter);
app.use(isAdmin, express.static("admin"));

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
