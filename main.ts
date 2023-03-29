import express from "express";
import path from "path";
import { attachRouter } from "./attachment";
import { userRouter } from "./login";
import { isAdmin, isUser } from "./login";

export const app = express();

app.use(express.static("public"));
app.use(userRouter);

//app.use(registerRouter);
app.use(isAdmin, express.static("admin"));
app.use(isUser, express.static("user")); //read the html and css file , sequence is matter, admin/user read the private
app.use(attachRouter);

app.use((req, res) => {
  res.status(404);
  res.sendFile(path.resolve("public", "404.html"));
});

let PORT = 8000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
