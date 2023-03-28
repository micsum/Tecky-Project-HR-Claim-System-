import express from "express";

const app = express();
// Need this for form submissions
app.use(express.urlencoded({ extended: true }));
// Need for later lectures
app.use(express.json());

app.post("/contact", (req, res) => {
  // Console log the request body to see what is inside!
  console.log(req.body);
});

app.use(express.static("public"));

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});