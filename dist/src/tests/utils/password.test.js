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
const password_utils_1 = require("../../utils/password.utils");
describe('Password Utilities', () => {
    const plainPassword = 'superSecure123';
    it('should hash a password and verify it correctly', () => __awaiter(void 0, void 0, void 0, function* () {
        const hashed = yield (0, password_utils_1.hashPassword)(plainPassword);
        expect(typeof hashed).toBe('string');
        expect(hashed).not.toBe(plainPassword);
        const isMatch = yield (0, password_utils_1.checkPassword)(plainPassword, hashed);
        expect(isMatch).toBe(true);
    }));
    it('should fail verification for incorrect password', () => __awaiter(void 0, void 0, void 0, function* () {
        const hashed = yield (0, password_utils_1.hashPassword)(plainPassword);
        const isMatch = yield (0, password_utils_1.checkPassword)('wrongPassword', hashed);
        expect(isMatch).toBe(false);
    }));
});
