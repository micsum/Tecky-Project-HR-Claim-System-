import { Router } from 'express'
import { loadArrayFromFile } from "./file-cb"

let userRouter = Router()

type user = {
    username: string
    password: string
}

let users = loadArrayFromFile<User>(filename,[])

userRouter