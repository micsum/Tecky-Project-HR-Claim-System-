import express from "express";
import path from "path";
import { attachRouter } from "./attachment";

export const app = express();

app.use(express.static("public"));
app.use(attachRouter);
app.use(express.json());

app.use((req, res) => {
  res.status(404);
  res.sendFile(path.resolve("public", "404.html"));
});



let PORT = 8000;

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
