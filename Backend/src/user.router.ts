import { Router,Request,Response} from "express";
import z, { number, string } from 'zod'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { authentication, Logging } from "./middleware/auth";
import { Alchemy, Network } from "alchemy-sdk";
import { Wallet, formatEther, parseEther, parseUnits } from "ethers";
import { TransactionRequest } from "@ethersproject/abstract-provider";
import CryptoJS from 'crypto-js'
import { Transaction,hexlify,JsonRpcProvider } from "ethers";
import generateName from "./wallet_name";
import { client } from "./middleware/prisma";
import rateLimit from "express-rate-limit"
import helmet from "helmet"



export const userRouter=Router()

const provider = new JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const seedLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5,
    message: { message: "Too many attempts, please try again later" }
})

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 10,
    message: { message: "Too many login attempts" }
})
const userSignupSchema=z.object({

    username:z.string().regex(/^\S+$/, "Username cannot contain spaces"),
    password:z.string(),
    firstName:z.string(),
    privateKey:z.string(),
    pubKey:z.string(),
    lastName:z.string(),
    email:z.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,"Email out of order")
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


function generateTokken(username: string, id: number, pubKey: string, firstName: string, lastName: string, createdAt: Date) {
    const accessTokken = jwt.sign(
        { username, id, pubKey, firstName, lastName, createdAt },
        process.env.ACCESS_TOKEN_PASSWORD as string,
        { expiresIn: "15m" }   
    )
    const refreshTokken = jwt.sign(
        { username, id },
        process.env.REFRESH_TOKEN_PASSWORD as string,
        { expiresIn: "7d" }    
    )
    return { accessTokken, refreshTokken }
}

userRouter.post("/signup",async (req:Request,res:Response):Promise<any>=>{
const resp=userSignupSchema.safeParse(req.body)
if(!resp.success) {return res.status(400).json({message:"No response"})}

const {username,password,firstName,lastName,email,pubKey,privateKey}=resp.data
if (!privateKey || !pubKey) return res.json({message:"the key pair not generated"})
    const wallet_name=generateName();
    const hashedPassword =await bcrypt.hash(password,10)
    const encryptedPrivateKey = CryptoJS.AES.encrypt(privateKey, process.env.CRYPTO_KEY as string).toString()
    const user=await client.user.create({data:{username,password:hashedPassword,firstName,lastName,privateKey:encryptedPrivateKey,pubKey,email,wallet_name}})
    if(!user) return res.status(400).json({message:"User not created"})
     res.status(200).json({message:"User Created"})
})


userRouter.post("/signin",authLimiter,async (req,res):Promise<any>=>{
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
        console.log(user.createdAt)
        const {accessTokken,refreshTokken}=generateTokken(user.username,user.id,user.pubKey,user.firstName,user.lastName,user.createdAt)
        const hashedRefreshToken = await bcrypt.hash(refreshTokken, 10)
        const updatedUser=await client.user.update({
        where:{
            id:user.id
        },
        data:{
            refreshTokken:hashedRefreshToken
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

userRouter.post("/txHistory",authentication,async(req:Logging,res):Promise<any>=>{
    const userId=req.id
    const network=req.body
    const user=await client.user.findFirst({
        where:{
            id:userId
        }
    })
    if(!user) return res.status(404).json({message:"User not found"})
    
    const apiKey = `${process.env.ALCHEMY_API_KEY}`;
    let url
    console.log(network)
    if(network.network=="mainnet") { 
        url=`${process.env.ALCHEMY_MAINNET_URL}`
    }
    else if(network.network=="sepolia"){ 
        url=`${process.env.ALCHEMY_SEPOLIA_URL}`
    }
    else if(network.network=="holesky"){
         url=`${process.env.ALCHEMY_HOLESKY_URL}`
    }
    console.log(url)
    console.log(apiKey)
    const baseURL = `${url}/${apiKey}`;
    console.log(baseURL)
    try {
    const incomingData = {
      jsonrpc: "2.0",
      id: 0,
      method: "alchemy_getAssetTransfers",
      params: [{
        fromBlock: "0x0",
        toAddress:user.pubKey,
        category: ["external","internal", "erc20", "erc721", "erc1155"],
      }]
    };

    const outgoingData={
        jsonrpc:"2.0",
        id:0,
        method:"alchemy_getAssetTransfers",
        params:[{
            fromBlock:"0x0",
            fromAddress:user.pubKey,
            category:["external","internal", "erc20", "erc721", "erc1155"],
            
        }]
    }


    const incomingResponse = await fetch(baseURL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(incomingData)
    });

    const outgoingRespone=await fetch(baseURL,{
        method:"POST",
        headers:{
            'Content-Type':'application/json'
        },
        body:JSON.stringify(outgoingData)
    })

    const incomingResult = await incomingResponse.json();
    const outgoingResult = await outgoingRespone.json();

    let incomingTransfers = incomingResult.result?.transfers || [];
    let outgoingTransfers = outgoingResult.result?.transfers || [];
    incomingTransfers=incomingTransfers.map((p:any)=>({
        ...p,
        incoming:true

    }))
   outgoingTransfers =outgoingTransfers.map((p:any)=>({
        ...p,
        incoming:false

    }))
    const allTransfers = [
  ...incomingTransfers,
  ...outgoingTransfers
];

    allTransfers.sort((a, b) => {
  return parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16);
});
allTransfers.slice(0,5)
    res.json(allTransfers)
  } catch (error) {
    console.error('Error:', error);
  }
})


//todo finish both routes
userRouter.post("/getBalance",authentication,async (req:Logging,res)=>{
    const userId=req.id
    const network=req.body


})

userRouter.post("/gasPrice",async(req,res)=>{
    const baseUrl=`${process.env.ALCHEMY_MAINNET_URL}/${process.env.ALCHEMY_API_KEY}`
    const options = {method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({
    "jsonrpc": "2.0",
    "method": "eth_gasPrice",
    "params": [],
    "id": 1
  }),};
try {
  const response = await fetch(baseUrl, options);
  const data = await response.json();
    res.send(data)
} catch (error) {
    throw error
}

})

// ADD this new route after /seed POST
userRouter.post("/seed/view", seedLimiter, authentication, async (req: Logging, res): Promise<any> => {
    try {
        const userId = req.id
        const seed = await client.seed.findFirst({ where: { userId } })
        if (!seed) return res.status(404).json({ message: "No seed found" })

        // Mark first view timestamp
        if (!seed.viewed) {
            await client.seed.update({
                where: { userId },
                // @ts-ignore
                data: { viewed: true, updatedAt: new Date() }
            })
        } else {
            // Second view — hard delete after returning
            const seedData = { ...seed }
            await client.seed.delete({ where: { userId } })
            return res.status(200).json({ seed: seedData, deleted: true })
        }

        return res.status(200).json({ seed, deleted: false })
    } catch (err) {
        console.error(err)
        return res.status(500).json({ message: "Failed to retrieve seed" })
    }
})

// Endpoint to check seed status (does it still exist, has it been viewed)
userRouter.post("/seed/status", authentication, async (req: Logging, res): Promise<any> => {
    const userId = req.id
    const seed = await client.seed.findFirst({ where: { userId } })
    if (!seed) return res.status(200).json({ exists: false })
    return res.status(200).json({ exists: true, viewed: seed.viewed })
})




userRouter.post(
  "/seed",
  authentication,
  async (req: Logging, res): Promise<any> => {
    try {
      const userId = req.id;
      const { encryptedSeed, iv, authTag, salt } = req.body;

      if (!encryptedSeed || !iv || !authTag || !salt) {
        return res.status(400).json({ message: "Missing seed fields" });
      }

      await client.seed.create({
        // @ts-ignore
        data: {
            userId,
          encryptedSeed,
          iv,
          authTag,
          salt,
        },
      });

      return res.status(200).json({ message: "Seed stored in DB" });
    } catch (err) {
      console.error(err);
      return res.status(500).json({ message: "Failed to store seed" });
    }
  }
);




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
        apiKey:process.env.ALCHEMY_API_KEY || "",
        network:Network.ETH_SEPOLIA}
                const alchemy=new Alchemy(config)
                const decodedtext=CryptoJS.AES.decrypt(user.privateKey,process.env.CRYPTO_KEY as string)
                const privateKey=decodedtext.toString(CryptoJS.enc.Utf8)
                const wallet=new Wallet(privateKey)

        const transaction={
            to:receiverAddress,
            value:parseEther(amt),
            gasLimit: "21000",
            maxPriorityFeePerGas: parseUnits("5", "gwei"),
            maxFeePerGas: parseUnits("20", "gwei"),
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
        apiKey:process.env.ALCHEMY_API_KEY || "",
        network:Network.ETH_SEPOLIA}
                const alchemy=new Alchemy(config)
                const decodedtext=CryptoJS.AES.decrypt(user.privateKey,process.env.CRYPTO_KEY as string)
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
        apiKey:process.env.ALCHEMY_API_KEY || "",
        network:Network.ETH_SEPOLIA}
                const alchemy=new Alchemy(config)
                const decodedtext=CryptoJS.AES.decrypt(user.privateKey,process.env.CRYPTO_KEY as string)
                const privateKey=decodedtext.toString(CryptoJS.enc.Utf8)
                const wallet=new Wallet(privateKey)

        const transaction={
            to:receiverAddress,
            value:parseEther(amt),
            gasLimit: "21000",
            maxPriorityFeePerGas: parseUnits("5", "gwei"),
            maxFeePerGas: parseUnits("20", "gwei"),
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
        apiKey:process.env.ALCHEMY_API_KEY || "",
        network:Network.ETH_SEPOLIA}
    const alchemy=new Alchemy(config)
    const decodedtext=CryptoJS.AES.decrypt(user.privateKey,process.env.CRYPTO_KEY as string)
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
            maxPriorityFeePerGas: parseUnits("5", "gwei"),
            maxFeePerGas: parseUnits("20", "gwei"),
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

userRouter.post("/getPrivateKey", authentication, async (req: Logging, res): Promise<any> => {
    const userId = req.id
    const { password } = req.body
    const user = await client.user.findFirst({ where: { id: userId } })
    if (!user) return res.status(404).json({ message: "User not found" })
    const verified = await bcrypt.compare(password, user.password)  // ADD await
    if (!verified) return res.status(401).json({ message: "Password not correct" })
    // Private key is already encrypted in DB — return it encrypted, let frontend decrypt
    return res.status(200).json({ encryptedPrivateKey: user.privateKey })
})


