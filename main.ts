import express from "express";
import path from "path";
import { attachRouter } from "./attachment";
<<<<<<< HEAD
import { isAdmin, isUser, userRouter } from "./login (old)";

export const app = express();

app.use(express.json());
app.use(userRouter);
=======
import { userRouter } from "./login";

export const app = express();

app.use(express.static("public"));
//app.use(userRouter);
>>>>>>> 59837d16218501034978d073de684f6260fed8e5
app.use(attachRouter);
app.use(registerRouter);

app.use(express.static("public"));
app.use(isUser, express.static("user"));
app.use(isAdmin, express.static("admin"));

app.use((req, res) => {
  res.status(404);
  res.sendFile(path.resolve("public", "404.html"));
});

let PORT = 8000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
