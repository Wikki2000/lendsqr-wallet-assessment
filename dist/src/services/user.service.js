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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createUser = createUser;
exports.loginUser = loginUser;
const BaseModel_1 = require("../models/BaseModel");
const password_utils_1 = require("../utils/password.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const uuid_1 = require("uuid");
// BaseModel instances
const userModel = new BaseModel_1.BaseModel('users');
const walletModel = new BaseModel_1.BaseModel('wallets');
function createUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        function generateAccountNumber() {
            const randomPart = Math.floor(10000000 + Math.random() * 90000000);
            return '100' + randomPart.toString();
        }
        try {
            if (!data.id) {
                data.id = (0, uuid_1.v4)();
            }
            if (!data.password) {
                throw new Error('Password is required');
            }
            data.password = yield (0, password_utils_1.hashPassword)(data.password);
            yield userModel.add(data);
            let accountNumber;
            let exists;
            // Ensure no user get same account number.
            do {
                accountNumber = generateAccountNumber();
                exists = yield walletModel.getBy({ accountNumber });
            } while (exists);
            // Create user wallet.
            yield walletModel.add({
                id: (0, uuid_1.v4)(),
                userId: data.id,
                accountNumber
            });
            return data.id;
        }
        catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('User already exists');
            }
            throw error;
        }
    });
}
function loginUser(data) {
    return __awaiter(this, void 0, void 0, function* () {
        const { password, userName, email } = data;
        if (!password || (!userName && !email)) {
            throw new Error('Username/email and password are required');
        }
        let user;
        if (email)
            user = yield userModel.getBy({ email });
        if (!user && userName)
            user = yield userModel.getBy({ userName });
        if (!user || !(yield (0, password_utils_1.checkPassword)(password, user.password))) {
            return null;
        }
        // Omit password
        const { password: _pw } = user, userData = __rest(user, ["password"]);
        return (0, jwt_utils_1.generateToken)(userData);
    });
}
