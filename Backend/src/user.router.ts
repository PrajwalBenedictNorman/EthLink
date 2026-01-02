import { PrismaClient } from "@prisma/client"
import {PrismaPg} from "@prisma/adapter-pg"
import { Router,Request,Response} from "express";
import z, { string } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authentication, Logging } from "./middleware /auth";
import { Wallet,Utils,Alchemy,Network, TransactionRequest } from "alchemy-sdk";
import CryptoJS from 'crypto-js'
import { Transaction,hexlify,JsonRpcProvider } from "ethers";
import generateName from "./wallet_name";
import { client } from "./middleware /prisma";




export const userRouter=Router()

const provider = new JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const userSignupSchema=z.object({

    username:z.string().regex(/^\S+$/, "Username cannot contain spaces"),
    password:z.string(),
    firstName:z.string(),
    privateKey:z.string(),
    pubKey:z.string(),
    lastName:string(),
    email:string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Email out of order")
})
const userSigninSchema=z.object({
    username:z.string().regex(/^\S+$/, "Username cannot contain spaces"),
    password:z.string()
})
// client.$use(async(params,next)=>{
//     if(params.model=='User')
//         if(params.action=='create' || params.action=='update')
//             if (params.args.data.password)
//                 params.args.data.password=await bcrypt.hash(params.args.data.password,10)


//     return next(params)
// })


function generateTokken(username:string,id:number,pubKey:string,firstName:string,lastName:string){
    const accessTokken=jwt.sign({username,id,pubKey,firstName,lastName},process.env.ACCESS_TOKEN_PASSWORD as string)
    const refreshTokken=jwt.sign({username,id},process.env.REFRESH_TOKEN_PASSWORD as string)
    
    return {accessTokken,refreshTokken}
}

userRouter.post("/signup",async (req:Request,res:Response):Promise<any>=>{
const resp=userSignupSchema.safeParse(req.body)
if(!resp.success) {return res.status(400).json({message:"No response"})}

const {username,password,firstName,lastName,email,pubKey,privateKey}=resp.data
if (!privateKey || !pubKey) return res.json({message:"the key pair not generated"})
    const wallet_name=generateName();
    const hashedPassword =await bcrypt.hash(password,10)
    const user=await client.user.create({data:{username,password:hashedPassword,firstName,lastName,privateKey,pubKey,email,wallet_name}})
    if(!user) return res.status(400).json({message:"User not created"})
     res.status(200).json({message:"User Created"})
})


userRouter.post("/signin",async (req,res):Promise<any>=>{
    const resp=userSigninSchema.safeParse(req.body)
if(!resp.success) {return res.status(400).json({message:"No response"})}
const {username,password}=resp.data

const user=await client.user.findFirst({
    where:{
        username
    }
})
if(!user || !user.password) return res.json({message:"No user found"})
    const verified=await bcrypt.compare(password,user.password)
    if(!verified) return res.json({message:"Wrong password"})
        const {accessTokken,refreshTokken}=generateTokken(user.username,user.id,user.pubKey,user.firstName,user.lastName)
    const updatedUser=await client.user.update({
        where:{
            id:user.id
        },
        data:{
            refreshTokken
        }
        //todo remove accessToken from schema 
    })

    if(!updatedUser) return res.status(400).json({message:"Not updated the user"})
        console.log(accessTokken)
        res.status(200).json({message:"User Signed in",accessTokken})

})

userRouter.post("/userDetails",authentication,async(req:Logging,res):Promise<any>=>{
    const id=req.id
    try {
        const user=await client.user.findFirst({
            where:{
                id
            },select:{
                firstName:true,
                lastName:true,
                email:true,
                wallet_name:true
            }
        })
        if (!user) return res.status(404).json({message:"User not found"})
            return res.status(200).json({user})
    } catch (error) {
        console.log(error)
    }
})  





 userRouter.post("/signAndSendTransaction",authentication,async (req:Logging,res):Promise<any>=>{
        const id=req.id

        const {receiverAddress,amt}=req.body
        if (!receiverAddress || !amt) {
        return res.status(400).json({ message: "receiverAddress and amt are required" });
        }
        const user=await client.user.findFirst({
            where:{
                id
            }
        })
        if(!user) return res.json({message:"User not found"})
            const config={
        apiKey:"x5I5ztoO52GtDKWL-lKBO37frG5AbCZf",
        network:Network.ETH_SEPOLIA}
                const alchemy=new Alchemy(config)
                const decodedtext=CryptoJS.AES.decrypt(user.privateKey,process.env.CRYPTO_KEY as string)
                const privateKey=decodedtext.toString(CryptoJS.enc.Utf8)
                const wallet=new Wallet(privateKey)

        const transaction={
            to:receiverAddress,
            value:Utils.parseEther(amt),
            gasLimit: "21000",
            maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
            maxFeePerGas: Utils.parseUnits("20", "gwei"),
            nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
            type: 2,
            chainId:11155111,
        }
        try {
    const rawTransaction = await wallet.signTransaction(transaction);
    const response = await alchemy.transact.sendTransaction(rawTransaction);
    return res.status(200).json({ hash: response.hash });
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({ message: "Transaction failed", error });
  }
    })





 userRouter.post("/signTransaction",authentication,async (req:Logging,res):Promise<any>=>{
        const id=req.id

        const {transaction}=req.body
        if (!transaction) {
        return res.status(400).json({ message: "transaction are required" });
        }
        const user=await client.user.findFirst({
            where:{
                id
            }
        })
        if(!user) return res.json({message:"User not found"})
            const config={
        apiKey:"x5I5ztoO52GtDKWL-lKBO37frG5AbCZf",
        network:Network.ETH_SEPOLIA}
                const alchemy=new Alchemy(config)
                const decodedtext=CryptoJS.AES.decrypt(user.privateKey,"Secrect_key_to_Enter")
                const privateKey=decodedtext.toString(CryptoJS.enc.Utf8)
                const wallet=new Wallet(privateKey)

        try {
    const rawTransaction = await wallet.signTransaction(transaction);
    return res.status(200).json({ rawTransaction });
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({ message: "Transaction failed", error });
  }
    })




userRouter.post("/signRawTransaction",authentication,async (req:Logging,res):Promise<any>=>{
        const id=req.id

        const {receiverAddress,amt}=req.body
        if (!receiverAddress || !amt) {
        return res.status(400).json({ message: "receiverAddress and amt are required" });
        }
        const user=await client.user.findFirst({
            where:{
                id
            }
        })
        if(!user) return res.json({message:"User not found"})
            const config={
        apiKey:"x5I5ztoO52GtDKWL-lKBO37frG5AbCZf",
        network:Network.ETH_SEPOLIA}
                const alchemy=new Alchemy(config)
                const decodedtext=CryptoJS.AES.decrypt(user.privateKey,"Secrect_key_to_Enter")
                const privateKey=decodedtext.toString(CryptoJS.enc.Utf8)
                const wallet=new Wallet(privateKey)

        const transaction={
            to:receiverAddress,
            value:Utils.parseEther(amt),
            gasLimit: "21000",
            maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
            maxFeePerGas: Utils.parseUnits("20", "gwei"),
            nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
            type: 2,
            chainId:11155111,
        }
        try {
    const rawTransaction = await wallet.signTransaction(transaction);
    // const response = await alchemy.transact.sendTransaction(rawTransaction);
    return res.status(200).json({ hash: rawTransaction });
  } catch (error) {
    console.error("Transaction error:", error);
    return res.status(500).json({ message: "Transaction failed", error });
  }
    })


userRouter.post("/signAndSendDappTransaction", authentication, async (req:Logging, res: Response):Promise<any> => {
  const tx=req.body.transaction
    const id =req.id 
    const user=await client.user.findFirst({
        where:{
            id
        }
    })
    if(!user) return res.json({message:"No user found"})

    const config={
        apiKey:"x5I5ztoO52GtDKWL-lKBO37frG5AbCZf",
        network:Network.ETH_SEPOLIA}
    const alchemy=new Alchemy(config)
    const decodedtext=CryptoJS.AES.decrypt(user.privateKey,"Secrect_key_to_Enter")
    const privateKey=decodedtext.toString(CryptoJS.enc.Utf8)
    const wallet=new Wallet(privateKey,alchemy)

    const bytesArray=Object.values(tx)
    const bytesHash=Uint8Array.from(bytesArray)
    // var decoder = new TextDecoder('utf8');
    // var txx = btoa(decoder.decode(bytesHash));
      const rawTx = "0x" + Buffer.from(bytesHash).toString("hex");
      const parsed= Transaction.from(rawTx)
      console.log(parsed)
      const resetTransaction={
            to:parsed.to ?? undefined,
            value:parsed.value,
            gasLimit: "21000",
            maxPriorityFeePerGas: Utils.parseUnits("5", "gwei"),
            maxFeePerGas: Utils.parseUnits("20", "gwei"),
            nonce: await alchemy.core.getTransactionCount(wallet.getAddress()),
            type: 2,
            chainId:11155111,
        }
         if(!resetTransaction) return res.json({message:"No reset Transaction"})
        const rawTransaction=await wallet.signTransaction(resetTransaction) 
    try {
        const result=await alchemy.transact.sendTransaction(rawTransaction)
        console.log(result)
    } catch (error) {
        console.log(error)
    }

});



