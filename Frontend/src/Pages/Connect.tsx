import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
import type { Wallet } from '@wallet-standard/base';
import { jwtDecode } from "jwt-decode";

function Connect() {
    const [connect,setConnect]=useState(false)
    const [ethAddress,setEthAddress]=useState("")
    const [transaction,setTransaction]=useState(true)
    const [searchParam,setSearchParam]=useSearchParams()
    console.log(searchParam)
    const redirectUri=searchParam.get('redirect_uri') as string
    const functionPer =searchParam.get("function") as string
    const txBytes=searchParam.get("txHash")
      
    console.log(txBytes)
    useEffect(()=>{
        if(functionPer==='connect') {
          setConnect(true)
          setTransaction(false)
        }
        else if(functionPer==='signAndSendTransaction') {
          setTransaction(true)
          setConnect(false)
        } 
    },[functionPer])
  
function connectDapp(){
  const accessTokken=sessionStorage.getItem('accessTokken') as string
  const decoded=jwtDecode<{pubKey:string}>(accessTokken) 
  const pubKey=decoded.pubKey
    window.location.href=`${redirectUri}?wallet_address=${encodeURIComponent(pubKey)}&redirect_uri=${encodeURIComponent(window.location.origin)+"/Home/connect"}`
    setConnect(false)
}

async function confirmTransaction(){
  if(!txBytes) return
  const accessTokken=sessionStorage.getItem('accessTokken') as string
  const pubKey=jwtDecode(accessTokken) as string
  const byteArray = txBytes.split(',').map(Number);
const txUint8Array = new Uint8Array(byteArray);
const account={
    address:pubKey,
    pubKey:new Uint8Array(33),
    chains:["eip155:11155111"],
    features:['signAndSendTransaction']
   }
  const wallets:readonly Wallet[]=await (navigator as any).wallets.get()
  const wallet=wallets.find((w)=>w.name==='EthLink') as Wallet
   if (!wallet) {
  alert("wallet not found");
  return;
}
const input = {
  account,
  transaction: txUint8Array,
  chain: 'eip155:11155111'
}
const signAndSendFeature = wallet.features['experimental:signAndSendTransaction'];
if (!signAndSendFeature) return alert("signAndSendTransaction not available");

//@ts-ignore
const result = await signAndSendFeature.signAndSendTransaction(input);

if(result) window.location.href=`${encodeURIComponent(redirectUri)}?signautre=${result}`
}


  return (
    <div className="bg-[#25274D] min-h-screen fixed min-w-screen">
        {connect && <>
        <div className="bg-[#AAABB8]  min-h-25  flex justify-between items-center">
        <div>
            <h1 className="text-6xl font-bold mx-10">EthLink</h1>
          </div>
          <div> 
            <img src="profile.png" alt="User Profile" onClick={()=>{}} />
          </div>
        </div>
        <div>
            <h1 className="text-white text-2xl mt-12 ms-20">
                Do you want to connect to Dapp
            </h1>
            <button className="mt-10 bg-[#464866] rounded-2xl p-2 ms-20 text-white cursor-pointer" onClick={connectDapp}>Connect</button>
        </div>
      
      
      
      </>}
      {transaction && <>
           <div className="bg-[#AAABB8]  min-h-25  flex justify-between items-center">
        <div>
            <h1 className="text-6xl font-bold mx-10">EthLink</h1>
          </div>
          <div> 
            <img src="profile.png" alt="User Profile" onClick={()=>{}} />
          </div>
        </div>
        <div>
            <h1 className="text-white text-2xl mt-12 ms-20">
                Do you want to confirm transaction
            </h1>
            <button className="mt-10 bg-[#464866] rounded-2xl p-2 ms-20 text-white cursor-pointer" onClick={confirmTransaction}>Confirm</button>
        </div>
      
        </>
      }
    </div>
  )
}

export default Connect
