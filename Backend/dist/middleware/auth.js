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
exports.authentication = authentication;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwt_decode_1 = require("jwt-decode");
function authentication(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const accessTokken = req.headers.authorization;
        if (!accessTokken)
            return res.json({ message: "No access tokken" });
        const verified = jsonwebtoken_1.default.verify(accessTokken, process.env.ACCESS_TOKEN_PASSWORD);
        if (!verified)
            return res.json({ message: "Not authorized" });
        const decoded = (0, jwt_decode_1.jwtDecode)(accessTokken);
        req.id = decoded.id;
        next();
    });
}
