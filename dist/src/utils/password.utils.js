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
exports.validatePasswordStrength = exports.checkPassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const SALT_ROUNDS = 10;
/**
 * Hash a plain text password
 */
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return bcryptjs_1.default.hash(password, SALT_ROUNDS);
});
exports.hashPassword = hashPassword;
/**
 * Compare plain text password with hashed one
 */
const checkPassword = (plainPassword, hashedPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const isMatch = yield bcryptjs_1.default.compare(plainPassword, hashedPassword);
    return isMatch;
});
exports.checkPassword = checkPassword;
/**
 * Checks if a password meets basic strength requirements:
 * - Minimum 8 characters
 * - At least one lowercase, one uppercase, one number, and one special character
 *
 * @param password - The password string to validate
 * @returns An error message if invalid, or null if valid
 */
const validatePasswordStrength = (password) => {
    if (password.length < 8) {
        return 'Password must be at least 8 characters long';
    }
    if (!/[a-z]/.test(password)) {
        return 'Password must contain at least one lowercase letter';
    }
    if (!/[A-Z]/.test(password)) {
        return 'Password must contain at least one uppercase letter';
    }
    if (!/[0-9]/.test(password)) {
        return 'Password must contain at least one number';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
        return 'Password must contain at least one special character';
    }
    return null; // valid password
};
exports.validatePasswordStrength = validatePasswordStrength;
