 import { Router } from 'express'

 export let userRoute = Router()

 export type User = {
    id:number
    username: string
    password: string
 }
 let users: User[] = []
let maxId =  users.reduce((acc,user) => Math.max(acc,user.id),0) + 1
 userRoute.get('/admin/create_user'), (req, res) => {
    res.json(user => ({
        id:user.id,
        username: user.username,
    })),
 }

 userRoute.post('admin/create_user'), (req, res) => {
    maxId ++
    let username = req.body.username
    let password = req.body.password
    users.push({
        id: maxId,
        username,
        password,
    })
    res.json({})
 }