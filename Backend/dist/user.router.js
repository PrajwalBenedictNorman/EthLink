"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const express_1 = require("express");
const zod_1 = __importDefault(require("zod"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./middleware /auth");
const alchemy_sdk_1 = require("alchemy-sdk");
const crypto_js_1 = __importDefault(require("crypto-js"));
const ethers_1 = require("ethers");
const wallet_name_1 = __importDefault(require("./wallet_name"));
const prisma_1 = require("./middleware /prisma");
exports.userRouter = (0, express_1.Router)();
const provider = new ethers_1.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const userSignupSchema = zod_1.default.object({
    username: zod_1.default.string().regex(/^\S+$/, "Username cannot contain spaces"),
    password: zod_1.default.string(),
    firstName: zod_1.default.string(),
    privateKey: zod_1.default.string(),
    pubKey: zod_1.default.string(),
    lastName: zod_1.default.string(),
    email: zod_1.default.string().regex(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Email out of order")
});
const userSigninSchema = zod_1.default.object({
    username: zod_1.default.string().regex(/^\S+$/, "Username cannot contain spaces"),
    password: zod_1.default.string()
});
// client.$use(async(params,next)=>{
//     if(params.model=='User')
//         if(params.action=='create' || params.action=='update')
//             if (params.args.data.password)
//                 params.args.data.password=await bcrypt.hash(params.args.data.password,10)
//     return next(params)
// })
function generateTokken(username, id, pubKey, firstName, lastName, createdAt) {
    console.log(createdAt);
    const accessTokken = jsonwebtoken_1.default.sign({ username, id, pubKey, firstName, lastName, createdAt }, process.env.ACCESS_TOKEN_PASSWORD);
    const refreshTokken = jsonwebtoken_1.default.sign({ username, id }, process.env.REFRESH_TOKEN_PASSWORD);
    return { accessTokken, refreshTokken };
}
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = userSignupSchema.safeParse(req.body);
    if (!resp.success) {
        return res.status(400).json({ message: "No response" });
    }
    const { username, password, firstName, lastName, email, pubKey, privateKey } = resp.data;
    if (!privateKey || !pubKey)
        return res.json({ message: "the key pair not generated" });
    const wallet_name = (0, wallet_name_1.default)();
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    const user = yield prisma_1.client.user.create({ data: { username, password: hashedPassword, firstName, lastName, privateKey, pubKey, email, wallet_name } });
    if (!user)
        return res.status(400).json({ message: "User not created" });
    res.status(200).json({ message: "User Created" });
}));
exports.userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = userSigninSchema.safeParse(req.body);
    if (!resp.success) {
        return res.status(400).json({ message: "No response" });
    }
    const { username, password } = resp.data;
    const user = yield prisma_1.client.user.findFirst({
        where: {
            username
        }
    });
    if (!user || !user.password)
        return res.json({ message: "No user found" });
    const verified = yield bcrypt_1.default.compare(password, user.password);
    if (!verified)
        return res.json({ message: "Wrong password" });
    console.log(user.createdAt);
    const { accessTokken, refreshTokken } = generateTokken(user.username, user.id, user.pubKey, user.firstName, user.lastName, user.createdAt);
    const updatedUser = yield prisma_1.client.user.update({
        where: {
            id: user.id
        },
        data: {
            refreshTokken
        }
        //todo remove accessToken from schema 
    });
    if (!updatedUser)
        return res.status(400).json({ message: "Not updated the user" });
    console.log(accessTokken);
    res.status(200).json({ message: "User Signed in", accessTokken });
}));
exports.userRouter.post("/userDetails", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    try {
        const user = yield prisma_1.client.user.findFirst({
            where: {
                id
            }, select: {
                firstName: true,
                lastName: true,
                email: true,
                wallet_name: true
            }
        });
        if (!user)
            return res.status(404).json({ message: "User not found" });
        return res.status(200).json({ user });
    }
    catch (error) {
        console.log(error);
    }
}));
exports.userRouter.post("/txHistory", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userId = req.id;
    const network = req.body;
    const user = yield prisma_1.client.user.findFirst({
        where: {
            id: userId
        }
    });
    if (!user)
        return res.status(404).json({ message: "User not found" });
    const apiKey = `${process.env.ALCHEMY_API_KEY}`;
    let url;
    console.log(network);
    if (network.network == "mainnet") {
        url = `${process.env.ALCHEMY_MAINNET_URL}`;
    }
    else if (network.network == "sepolia") {
        url = `${process.env.ALCHEMY_SEPOLIA_URL}`;
    }
    else if (network.network == "holesky") {
        url = `${process.env.ALCHEMY_HOLESKY_URL}`;
    }
    console.log(url);
    console.log(apiKey);
    const baseURL = `${url}/${apiKey}`;
    console.log(baseURL);
    try {
        const incomingData = {
            jsonrpc: "2.0",
            id: 0,
            method: "alchemy_getAssetTransfers",
            params: [{
                    fromBlock: "0x0",
                    toAddress: user.pubKey,
                    category: ["external", "internal", "erc20", "erc721", "erc1155"],
                }]
        };
        const outgoingData = {
            jsonrpc: "2.0",
            id: 0,
            method: "alchemy_getAssetTransfers",
            params: [{
                    fromBlock: "0x0",
                    fromAddress: user.pubKey,
                    category: ["external", "internal", "erc20", "erc721", "erc1155"],
                }]
        };
        const incomingResponse = yield fetch(baseURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(incomingData)
        });
        const outgoingRespone = yield fetch(baseURL, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(outgoingData)
        });
        const incomingResult = yield incomingResponse.json();
        const outgoingResult = yield outgoingRespone.json();
        let incomingTransfers = ((_a = incomingResult.result) === null || _a === void 0 ? void 0 : _a.transfers) || [];
        let outgoingTransfers = ((_b = outgoingResult.result) === null || _b === void 0 ? void 0 : _b.transfers) || [];
        incomingTransfers = incomingTransfers.map((p) => (Object.assign(Object.assign({}, p), { incoming: true })));
        outgoingTransfers = outgoingTransfers.map((p) => (Object.assign(Object.assign({}, p), { incoming: false })));
        const allTransfers = [
            ...incomingTransfers,
            ...outgoingTransfers
        ];
        allTransfers.sort((a, b) => {
            return parseInt(b.blockNum, 16) - parseInt(a.blockNum, 16);
        });
        allTransfers.slice(0, 5);
        res.json(allTransfers);
    }
    catch (error) {
        console.error('Error:', error);
    }
}));
exports.userRouter.post("/getBalance", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.id;
    const network = req.body;
}));
exports.userRouter.post("/seed", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.id;
        const { encryptedSeed, iv, authTag, salt } = req.body;
        if (!encryptedSeed || !iv || !authTag || !salt) {
            return res.status(400).json({ message: "Missing seed fields" });
        }
        yield prisma_1.client.seed.create({
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
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Failed to store seed" });
    }
}));
exports.userRouter.post("/signAndSendTransaction", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const { receiverAddress, amt } = req.body;
    if (!receiverAddress || !amt) {
        return res.status(400).json({ message: "receiverAddress and amt are required" });
    }
    const user = yield prisma_1.client.user.findFirst({
        where: {
            id
        }
    });
    if (!user)
        return res.json({ message: "User not found" });
    const config = {
        apiKey: process.env.ALCHEMY_API_KEY || "",
        network: alchemy_sdk_1.Network.ETH_SEPOLIA
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    const decodedtext = crypto_js_1.default.AES.decrypt(user.privateKey, process.env.CRYPTO_KEY);
    const privateKey = decodedtext.toString(crypto_js_1.default.enc.Utf8);
    const wallet = new alchemy_sdk_1.Wallet(privateKey);
    const transaction = {
        to: receiverAddress,
        value: alchemy_sdk_1.Utils.parseEther(amt),
        gasLimit: "21000",
        maxPriorityFeePerGas: alchemy_sdk_1.Utils.parseUnits("5", "gwei"),
        maxFeePerGas: alchemy_sdk_1.Utils.parseUnits("20", "gwei"),
        nonce: yield alchemy.core.getTransactionCount(wallet.getAddress()),
        type: 2,
        chainId: 11155111,
    };
    try {
        const rawTransaction = yield wallet.signTransaction(transaction);
        const response = yield alchemy.transact.sendTransaction(rawTransaction);
        return res.status(200).json({ hash: response.hash });
    }
    catch (error) {
        console.error("Transaction error:", error);
        return res.status(500).json({ message: "Transaction failed", error });
    }
}));
exports.userRouter.post("/signTransaction", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const { transaction } = req.body;
    if (!transaction) {
        return res.status(400).json({ message: "transaction are required" });
    }
    const user = yield prisma_1.client.user.findFirst({
        where: {
            id
        }
    });
    if (!user)
        return res.json({ message: "User not found" });
    const config = {
        apiKey: process.env.ALCHEMY_API_KEY || "",
        network: alchemy_sdk_1.Network.ETH_SEPOLIA
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    const decodedtext = crypto_js_1.default.AES.decrypt(user.privateKey, process.env.CRYPTO_KEY);
    const privateKey = decodedtext.toString(crypto_js_1.default.enc.Utf8);
    const wallet = new alchemy_sdk_1.Wallet(privateKey);
    try {
        const rawTransaction = yield wallet.signTransaction(transaction);
        return res.status(200).json({ rawTransaction });
    }
    catch (error) {
        console.error("Transaction error:", error);
        return res.status(500).json({ message: "Transaction failed", error });
    }
}));
exports.userRouter.post("/signRawTransaction", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const { receiverAddress, amt } = req.body;
    if (!receiverAddress || !amt) {
        return res.status(400).json({ message: "receiverAddress and amt are required" });
    }
    const user = yield prisma_1.client.user.findFirst({
        where: {
            id
        }
    });
    if (!user)
        return res.json({ message: "User not found" });
    const config = {
        apiKey: process.env.ALCHEMY_API_KEY || "",
        network: alchemy_sdk_1.Network.ETH_SEPOLIA
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    const decodedtext = crypto_js_1.default.AES.decrypt(user.privateKey, process.env.CRYPTO_KEY);
    const privateKey = decodedtext.toString(crypto_js_1.default.enc.Utf8);
    const wallet = new alchemy_sdk_1.Wallet(privateKey);
    const transaction = {
        to: receiverAddress,
        value: alchemy_sdk_1.Utils.parseEther(amt),
        gasLimit: "21000",
        maxPriorityFeePerGas: alchemy_sdk_1.Utils.parseUnits("5", "gwei"),
        maxFeePerGas: alchemy_sdk_1.Utils.parseUnits("20", "gwei"),
        nonce: yield alchemy.core.getTransactionCount(wallet.getAddress()),
        type: 2,
        chainId: 11155111,
    };
    try {
        const rawTransaction = yield wallet.signTransaction(transaction);
        // const response = await alchemy.transact.sendTransaction(rawTransaction);
        return res.status(200).json({ hash: rawTransaction });
    }
    catch (error) {
        console.error("Transaction error:", error);
        return res.status(500).json({ message: "Transaction failed", error });
    }
}));
exports.userRouter.post("/signAndSendDappTransaction", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const tx = req.body.transaction;
    const id = req.id;
    const user = yield prisma_1.client.user.findFirst({
        where: {
            id
        }
    });
    if (!user)
        return res.json({ message: "No user found" });
    const config = {
        apiKey: process.env.ALCHEMY_API_KEY || "",
        network: alchemy_sdk_1.Network.ETH_SEPOLIA
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    const decodedtext = crypto_js_1.default.AES.decrypt(user.privateKey, process.env.CRYPTO_KEY);
    const privateKey = decodedtext.toString(crypto_js_1.default.enc.Utf8);
    const wallet = new alchemy_sdk_1.Wallet(privateKey, alchemy);
    const bytesArray = Object.values(tx);
    const bytesHash = Uint8Array.from(bytesArray);
    // var decoder = new TextDecoder('utf8');
    // var txx = btoa(decoder.decode(bytesHash));
    const rawTx = "0x" + Buffer.from(bytesHash).toString("hex");
    const parsed = ethers_1.Transaction.from(rawTx);
    console.log(parsed);
    const resetTransaction = {
        to: (_a = parsed.to) !== null && _a !== void 0 ? _a : undefined,
        value: parsed.value,
        gasLimit: "21000",
        maxPriorityFeePerGas: alchemy_sdk_1.Utils.parseUnits("5", "gwei"),
        maxFeePerGas: alchemy_sdk_1.Utils.parseUnits("20", "gwei"),
        nonce: yield alchemy.core.getTransactionCount(wallet.getAddress()),
        type: 2,
        chainId: 11155111,
    };
    if (!resetTransaction)
        return res.json({ message: "No reset Transaction" });
    const rawTransaction = yield wallet.signTransaction(resetTransaction);
    try {
        const result = yield alchemy.transact.sendTransaction(rawTransaction);
        console.log(result);
    }
    catch (error) {
        console.log(error);
    }
}));
