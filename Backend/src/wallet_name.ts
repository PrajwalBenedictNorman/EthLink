import crypto from "node:crypto"
function generateName(){
    const randomByte=crypto.randomBytes(12).toString("hex")
    const name="wlt_"+randomByte
    return name
}

export default generateName