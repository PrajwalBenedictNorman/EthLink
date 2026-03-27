import jwt from "jsonwebtoken"
import { Request, Response, NextFunction } from "express"
import { jwtDecode } from "jwt-decode"

export interface Logging extends Request {
    id?: number
}

export async function authentication(req: Logging, res: Response, next: NextFunction): Promise<any> {
    const accessToken = req.headers.authorization
    if (!accessToken) return res.status(401).json({ message: "No access token" })
    try {
        const verified = jwt.verify(accessToken, process.env.ACCESS_TOKEN_PASSWORD as string)
        if (!verified) return res.status(401).json({ message: "Not authorized" })
        const decoded = jwtDecode<{ id: number }>(accessToken)
        req.id = decoded.id
        next()
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" })
    }
}