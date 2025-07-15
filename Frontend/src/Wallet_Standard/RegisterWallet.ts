import {registerWallet} from "@wallet-standard/wallet"
import { EthereumWallet  } from "./EthereumWallet"

const wallet = new EthereumWallet()

registerWallet(wallet)

if (!('wallets' in navigator)) {
  (navigator as any).wallets = {
    get: () => [wallet],
    push: (w: any) => {}, 
  };
} else {
  (navigator as any).wallets.push(wallet);
}