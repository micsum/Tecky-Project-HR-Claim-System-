import express from "express";

export function isUser( //check the session is User or not
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  if (!!req.session.user) {
    console.log("Oh yes")
    return next();
  } 
  
  return res.status(401).redirect("/");
}