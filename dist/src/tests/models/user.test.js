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
describe('UserModel', () => {
    const testEmail = 'jest-test@example.com';
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Run migrations before tests start
        yield knex_1.default.migrate.latest();
    }));
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        // Clean up test data
        yield (0, knex_1.default)('users').where({ email: testEmail }).delete();
        yield knex_1.default.destroy();
    }));
    test('should add a new user', () => __awaiter(void 0, void 0, void 0, function* () {
        // Add user
        const [id] = yield User_1.User.add({
            email: testEmail,
            firstName: 'John',
            lastName: 'Doe',
            userName: 'test',
            phone: '1234567890',
        });
        console.log(id);
        expect(typeof id).toBe('number');
    }));
    test('should fetch user by parameters', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.User.getBy({ email: testEmail });
        expect(user).toBeDefined();
        expect(user.firstName).toBe('John');
        expect(user.lastName).toBe('Doe');
        expect(user.email).toBe(testEmail);
    }));
    test('should return undefined for non-existing user', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.User.getBy({ email: 'notfound@example.com' });
        expect(user).toBeUndefined();
    }));
});
