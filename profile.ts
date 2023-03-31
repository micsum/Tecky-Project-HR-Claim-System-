import  express, { Router } from "express";

export let profileRouter = Router()

profileRouter.use(express.static("protected")); //read the html and css file , sequence is matter, public guy watch public
profileRouter.use(express.urlencoded({ extended: true })); //middleware for html-form-post
profileRouter.use(express.json());

profileRouter.get("/profile", (req, res) => {
    res.redirect("profile.html");
  });