import express, { Router } from "express";
import { sessionMiddleware } from "./login";

export let emailRouter = Router();

emailRouter.use(express.json());
emailRouter.use(sessionMiddleware);
