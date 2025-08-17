import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './user.router'
dotenv.config()
const app=express()
app.use(cors())

app.use(express.json())
app.use("/user",userRouter)

app.listen(process.env.PORT)