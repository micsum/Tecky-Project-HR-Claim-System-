import express from 'express'
import { print } from 'listening-on'
import path from 'path'
import { app } from './app'
import './memo-cb'
import { userRouter } from './user'

app.use(userRouter)

app.use(express.static('public'))

app.use((req, res) => {
  res.status(404)
  res.sendFile(path.resolve('public', '404.html'))
})

let PORT = 8100

app.listen(PORT, () => {
  print(PORT)
})
