import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { userRouter } from './user.router'
dotenv.config()
const app=express()

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}))

app.use(express.json())
app.use("/user",userRouter)

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})