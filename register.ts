import express, { Router } from "express";
import path from 'path';
//import expressSession from "express-session";
export let registerRouter = Router();

registerRouter.use(express.static("protected")); //read the html and css file , sequence is matter, public guy watch public
registerRouter.use(express.urlencoded()); //middleware for html-form-post

registerRouter.get('/adduser', (req,res) => {
    res.sendFile(path.resolve("protected","adduser.html"))
})

registerRouter.post('/adduser', (req,res) => {
    console.log('hi: ', req.body)
})