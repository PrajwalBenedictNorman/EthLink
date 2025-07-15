import jwt from "jsonwebtoken"
import { Request,Response,NextFunction } from "express"
import { jwtDecode } from "jwt-decode"

export interface Logging extends Request{
    id?:number
}
export async function authentication(req:Logging,res:Response,next:NextFunction):Promise<any>{
    const accessTokken= req.headers.authorization
    if(!accessTokken ) return res.json({message:"No access tokken"})
        const verified=jwt.verify(accessTokken,process.env.ACCESS_TOKEN_PASSWORD as string)
    if (!verified) return res.json({message:"Not authorized"})
    const decoded=jwtDecode<{id:number}>(accessTokken)
    req.id=decoded.id
    next()
}