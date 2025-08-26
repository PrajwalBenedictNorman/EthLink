"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const client_1 = require("@prisma/client");
const express_1 = require("express");
const zod_1 = __importStar(require("zod"));
const eth_wallet_1 = __importDefault(require("./eth_wallet"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./middleware/auth");
const alchemy_sdk_1 = require("alchemy-sdk");
const crypto_js_1 = __importDefault(require("crypto-js"));
const ethers_1 = require("ethers");
exports.userRouter = (0, express_1.Router)();
const client = new client_1.PrismaClient();
const provider = new ethers_1.JsonRpcProvider(`https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`);
const userSignupSchema = zod_1.default.object({
    username: zod_1.default.string().regex(/^\S+$/, "Username cannot contain spaces"),
    password: zod_1.default.string(),
    firstName: zod_1.default.string(),
    lastName: (0, zod_1.string)()
});
const userSigninSchema = zod_1.default.object({
    username: zod_1.default.string().regex(/^\S+$/, "Username cannot contain spaces"),
    password: zod_1.default.string()
});
client.$use((params, next) => __awaiter(void 0, void 0, void 0, function* () {
    if (params.model == 'User')
        if (params.action == 'create' || params.action == 'update')
            if (params.args.data.password)
                params.args.data.password = yield bcrypt_1.default.hash(params.args.data.password, 10);
    return next(params);
}));
function generateTokken(username, id, pubKey, firstName, lastName) {
    const accessTokken = jsonwebtoken_1.default.sign({ username, id, pubKey, firstName, lastName }, process.env.ACCESS_TOKEN_PASSWORD);
    const refreshTokken = jsonwebtoken_1.default.sign({ username, id }, process.env.REFRESH_TOKEN_PASSWORD);
    return { accessTokken, refreshTokken };
}
exports.userRouter.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const resp = userSignupSchema.safeParse(req.body);
    if (!resp.success) {
        return res.status(400).json({ message: "No response" });
    }
    const { privateKey, pubKey } = yield (0, eth_wallet_1.default)();
    const { username, password, firstName, lastName } = resp.data;
    if (!privateKey || !pubKey)
        return res.json({ message: "the key pair not generated" });
    const user = yield client.user.create({ data: { username, password, firstName, lastName, privateKey, pubKey } });
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
    const user = yield client.user.findFirst({
        where: {
            username
        }
    });
    if (!user || !user.password)
        return res.json({ message: "No user found" });
    const verified = yield bcrypt_1.default.compare(password, user.password);
    if (!verified)
        return res.json({ message: "Wrong password" });
    const { accessTokken, refreshTokken } = generateTokken(user.username, user.id, user.pubKey, user.firstName, user.lastName);
    const updatedUser = yield client.user.update({
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
exports.userRouter.post("/signAndSendTransaction", auth_1.authentication, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.id;
    const { receiverAddress, amt } = req.body;
    if (!receiverAddress || !amt) {
        return res.status(400).json({ message: "receiverAddress and amt are required" });
    }
    const user = yield client.user.findFirst({
        where: {
            id
        }
    });
    if (!user)
        return res.json({ message: "User not found" });
    const config = {
        apiKey: "x5I5ztoO52GtDKWL-lKBO37frG5AbCZf",
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
    const user = yield client.user.findFirst({
        where: {
            id
        }
    });
    if (!user)
        return res.json({ message: "User not found" });
    const config = {
        apiKey: "x5I5ztoO52GtDKWL-lKBO37frG5AbCZf",
        network: alchemy_sdk_1.Network.ETH_SEPOLIA
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    const decodedtext = crypto_js_1.default.AES.decrypt(user.privateKey, "Secrect_key_to_Enter");
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
    const user = yield client.user.findFirst({
        where: {
            id
        }
    });
    if (!user)
        return res.json({ message: "User not found" });
    const config = {
        apiKey: "x5I5ztoO52GtDKWL-lKBO37frG5AbCZf",
        network: alchemy_sdk_1.Network.ETH_SEPOLIA
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    const decodedtext = crypto_js_1.default.AES.decrypt(user.privateKey, "Secrect_key_to_Enter");
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
    const user = yield client.user.findFirst({
        where: {
            id
        }
    });
    if (!user)
        return res.json({ message: "No user found" });
    const config = {
        apiKey: "x5I5ztoO52GtDKWL-lKBO37frG5AbCZf",
        network: alchemy_sdk_1.Network.ETH_SEPOLIA
    };
    const alchemy = new alchemy_sdk_1.Alchemy(config);
    const decodedtext = crypto_js_1.default.AES.decrypt(user.privateKey, "Secrect_key_to_Enter");
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
