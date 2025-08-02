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
exports.createNewUser = void 0;
const axios_1 = __importDefault(require("axios"));
const user_service_1 = require("../services/user.service");
const validate_utils_1 = require("../utils/validate.utils");
const password_utils_1 = require("../utils/password.utils");
const KARMA_API_URL = 'https://adjutor.lendsqr.com/v2/verification/karma/';
const KARMA_API_KEY = process.env.KARMA_API_KEY;
const createNewUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const requiredFields = [
            'email', 'firstName', 'lastName', 'phone', 'userName', 'password'
        ];
        const data = req.body;
        const missingValue = (0, validate_utils_1.isMissingFields)(requiredFields, data);
        if (missingValue) {
            return res.status(400).json({ message: `${missingValue} is required` });
        }
        const { email, firstName, phone, lastName, userName, password } = req.body;
        // Check if user is in Lendsqr blacklist
        try {
            const karmaRes = yield axios_1.default.get(`${KARMA_API_URL}${email}`, {
                headers: {
                    Authorization: `Bearer ${KARMA_API_KEY}`
                }
            });
            const kamData = karmaRes.data;
            /*
            if (kamData.data?.karma_type) {
              return res.status(403).json({
                message: 'User is blacklisted in the Lendsqr Karma database and cannot be onboarded.',
              });
            }*/
        }
        catch (error) {
            const err = error;
            console.error('Karma API error:', error);
            return res.status(502).json({ message: 'Failed to verify user with Karma API' });
        }
        // Validate password strength
        const strengthMsg = (0, password_utils_1.validatePasswordStrength)(password);
        if (strengthMsg) {
            return res.status(422).json({ message: strengthMsg });
        }
        // Create user
        const userId = yield (0, user_service_1.createUser)({
            email, firstName, lastName, phone, userName, password
        });
        return res.status(201).json({
            message: 'User created successfully',
            user_id: userId,
        });
    }
    catch (error) {
        if (error.message === 'User already exists') {
            return res.status(409).json({ message: error.message });
        }
        return res.status(500).json({ message: error.message || 'Internal server error' });
    }
});
exports.createNewUser = createNewUser;
