import type {IdentifierString, WalletAccount, ReadonlyUint8Array} from '@wallet-standard/base'
import type {StandardConnectFeature, Wallet} from "@wallet-standard/core"
import { jwtDecode } from "jwt-decode"
import axios from "axios";



export class EthereumWallet implements Wallet{
    readonly version= "1.0.0" as const ;
    readonly name= "EthLink" as const;
    readonly icon = "data:image/png;base64,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" as const;
    readonly chains=['eip155:11155111'] as const;
    readonly accounts: WalletAccount[]=[];
    
    _connect: StandardConnectFeature['standard:connect']['connect']=async ()=>{
        const accessTokken=sessionStorage.getItem("accessTokken") as string
        if (!accessTokken || typeof accessTokken !== "string") {
        throw new Error("No valid access token found in sessionStorage.");
        }
        const decoded=jwtDecode<{pubKey:string}>(accessTokken)
        const pubKey=decoded.pubKey
        this.accounts.length=0;
        this.accounts.push({
            address:pubKey,
            publicKey:new Uint8Array(33), // todo put actual publickey this is just parsing the system
            chains:this.chains,
            features: [
                'standard:connect',
                'standard:events',
                'experimental:signTransaction',
                'experimental:signAndSendTransaction'
            ] as any,
            icon:this.icon,
        })
        return {accounts:this.accounts}
    }
   
    #signTransaction:SignTransactionMethod=async (input)=>{
        const {account,transaction,chain}=input
     
        if (chain && !this.chains.includes('eip155:11155111')) {
        throw new Error('Unsupported chain');
    }
        const accessTokken=sessionStorage.getItem("accessTokken") as string
if (!accessTokken || typeof accessTokken !== "string") {
        throw new Error("No valid access token found in sessionStorage.");
    }
const decoded=jwtDecode<{pubKey:string}>(accessTokken)
const pubKey=decoded.pubKey 
       
        if(account.address !== pubKey) throw new Error("Invalid account")
        
         if (!confirm('Do you want to sign this transaction?')) {
        throw new Error('User rejected signing');
    } 
        const signedTx:Uint8Array=await axios.post("http://localhost:3000/user/signTransaction",{
            transaction
        },{headers:{Authorization:accessTokken}})
        return {signedTransaction: signedTx}
    }

    #signAndSendTransaction:SignAndSendTransactionMethod=async (input)=>{
           const {account,transaction,chain}=input
        if (chain && !this.chains.includes('eip155:11155111')) {
        throw new Error('Unsupported chain');
    }

        const accessTokken=sessionStorage.getItem("accessTokken") as string
        const decoded=jwtDecode<{pubKey:string}>(accessTokken)
        const pubKey=decoded.pubKey
        if(account.address !== pubKey) throw new Error("Invalid account")
        
         if (!confirm('Do you want to sign this transaction?')) {
        throw new Error('User rejected signing');
    } 

    const response=await axios.post("http://localhost:3000/user/signAndSendDappTransaction",{
        transaction
    },{
        headers:{

            Authorization:accessTokken
        }
    })

    const signature:Uint8Array=Uint8Array.from(Buffer.from(response.data.signedTx, 'hex'));
    
    return {signature}
    }

    features ={
        'standard:connect': {
            version:'1.0.0',
            connect:this._connect
        },
        'standard:events': {
            version:'1.0.0',
            on:()=>{}
        },
        'experimental:signAndSendTransaction': {
                version: '1.0.0',
                signAndSendTransaction:this.#signAndSendTransaction
            },

            'experimental:signTransaction': {
                version: '1.0.0',
                signTransaction:this.#signTransaction
            },

           
    }
}


type SignTransactionMethod=(input:{account:WalletAccount,transaction:ReadonlyUint8Array,chain?:IdentifierString})=>Promise<{signedTransaction:Uint8Array}>;
type SignAndSendTransactionMethod=(input:{account:WalletAccount,transaction:ReadonlyUint8Array,chain:IdentifierString})=>Promise<{signature:Uint8Array}>;