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
const bip39_1 = require("bip39");
const ethers_1 = require("ethers");
const crypto_js_1 = __importDefault(require("crypto-js"));
function generateKeyPair() {
    return __awaiter(this, void 0, void 0, function* () {
        const mnemonic = (0, bip39_1.generateMnemonic)();
        const seed = yield (0, bip39_1.mnemonicToSeed)(mnemonic);
        const derivationPath = "m/44'/60'/0'/0'";
        const hdNode = ethers_1.HDNodeWallet.fromSeed(seed);
        const child = hdNode.derivePath(derivationPath);
        const privaKey = child.privateKey;
        const wallet = new ethers_1.Wallet(privaKey);
        const pubKey = wallet.address;
        const privateKey = crypto_js_1.default.AES.encrypt(privaKey, process.env.CRYPTO_KEY).toString();
        return { privateKey, pubKey };
    });
}
exports.default = generateKeyPair;
