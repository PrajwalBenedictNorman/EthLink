import { generateMnemonic,mnemonicToSeed } from "bip39";
import { Wallet,HDNodeWallet } from "ethers";                 
import CryptoJS from 'crypto-js'

async function generateKeyPair(){
    const mnemonic=generateMnemonic()
    const seed=await mnemonicToSeed(mnemonic)
    const derivationPath="m/44'/60'/0'/0'"
    const hdNode=HDNodeWallet.fromSeed(seed)
    const child=hdNode.derivePath(derivationPath)
    const privaKey=child.privateKey
    const wallet= new Wallet(privaKey)
    const pubKey=wallet.address
    const privateKey=CryptoJS.AES.encrypt(privaKey,process.env.CRYPTO_KEY as string).toString()
    return {privateKey,pubKey}
}

export default generateKeyPair  