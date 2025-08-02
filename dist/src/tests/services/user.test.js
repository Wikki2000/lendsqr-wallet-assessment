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
describe('UserService', () => {
    const testEmail = 'jest-user@example.com';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //await db.migrate.latest();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, knex_1.default)('users').where({ email: testEmail }).delete();
        yield knex_1.default.destroy();
    }));
    test('should create a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = {
            id: (0, uuid_1.v4)(),
            email: testEmail,
            userName: 'jestUser',
            firstName: 'Jest',
            lastName: 'Tester',
            password: '12345',
            phone: '1234567890',
        };
        const userId = yield (0, user_service_1.createUser)(user);
        expect(typeof userId).toBe('string');
    }));
    test('should not allow duplicate email', () => __awaiter(void 0, void 0, void 0, function* () {
        const duplicateUser = {
            id: (0, uuid_1.v4)(),
            email: testEmail,
            userName: 'duplicateUser',
            firstName: 'Jest',
            lastName: 'Tester',
            password: '12345',
            phone: '0987654321',
        };
        yield expect((0, user_service_1.createUser)(duplicateUser)).rejects.toThrow('User already exists');
    }));
});
