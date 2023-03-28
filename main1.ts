import express from "express";
import path from "path";
import { attachRouter } from "./attachment";

export const app = express();

app.use(express.urlencoded())
app.use(express.static("protected"));
app.use(attachRouter);
app.use(express.json());

app.use((req, res) => {
  res.status(404);
  res.sendFile(path.resolve("public", "404.html"));
});

app.use('/adduser', (req, res) => {
  res.sendFile(path.resolve("protected", "adduser.html"));
});

let PORT = 8100;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
