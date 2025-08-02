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
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const user_service_1 = require("../services/user.service");
const validate_utils_1 = require("../utils/validate.utils");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const requiredFields = ['password'];
    const data = req.body;
    const missingValue = (0, validate_utils_1.isMissingFields)(requiredFields, data);
    if (missingValue) {
        return res.status(400).json({ message: `${missingValue} is required` });
    }
    try {
        const token = yield (0, user_service_1.loginUser)(req.body);
        if (!token) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        res.json({ token });
    }
    catch (err) {
        res.status(500).json({ message: 'Login failed', error: err.message });
    }
});
exports.login = login;
