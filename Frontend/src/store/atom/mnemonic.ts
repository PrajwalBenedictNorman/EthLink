import {atom} from "recoil"

export const mnemonicAtom=atom({
    default:"",
    key:"mnemonic"
})

export const encryptedMemonicAtom=atom({
    default:"",
    key:"encryptedMemonic"
})