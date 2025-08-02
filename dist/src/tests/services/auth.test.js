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
const knex_1 = __importDefault(require("../../db/knex"));
const user_service_1 = require("../../services/user.service");
const uuid_1 = require("uuid");
describe('AuthUser Service', () => {
    const testPassword = 'StrongP@ssword123';
    const testEmail = 'auth-user@example.com';
    const testUserName = 'authUser';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield knex_1.default.migrate.latest();
        // create hashed password and user
        const user = {
            id: (0, uuid_1.v4)(),
            email: testEmail,
            userName: testUserName,
            firstName: 'Auth',
            lastName: 'Tester',
            phone: '08000000000',
            password: testPassword,
        };
        yield (0, user_service_1.createUser)(user);
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, knex_1.default)('users').where({ email: testEmail }).delete();
        yield knex_1.default.destroy();
    }));
    test('should authenticate using userName', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, user_service_1.loginUser)({ userName: testUserName, password: testPassword });
        expect(result).toBeTruthy();
    }));
    test('should authenticate using email', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, user_service_1.loginUser)({ email: testEmail, password: testPassword });
        expect(result).toBeTruthy();
    }));
    test('should fail with wrong password', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, user_service_1.loginUser)({ email: testEmail, password: 'WrongPass123!' });
        expect(result).toBeFalsy();
    }));
    test('should fail with unknown user', () => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield (0, user_service_1.loginUser)({ email: 'unknown@example.com', password: testPassword });
        expect(result).toBeFalsy();
    }));
});
