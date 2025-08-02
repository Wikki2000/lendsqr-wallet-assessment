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
exports.BaseModel = void 0;
const knex_1 = __importDefault(require("../db/knex"));
/**
 * BaseModel provides reusable methods for interacting with a database table.
 * It is a generic class, allowing type-safe operations for any data model.
 *
 * @template T - The schema/interface representing the table's data structure.
 */
class BaseModel {
    /**
     * Constructs a new BaseModel instance for a specific table.
     * @param tableName - The name of the database table.
     */
    constructor(tableName) {
        this.tableName = tableName;
    }
    /**
     * Insert a new record into the table.
     * @param data - Partial data object of type T to insert.
     * @returns A Promise resolving to the inserted row ID(s).
     */
    add(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)(this.tableName).insert(data);
        });
    }
    /**
     * Get a single record by one or more fields.
      * @param fields - Key-value pairs representing query conditions.
      * @returns A Promise resolving to the first matching record, or undefined if not found.
      */
    getBy(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)(this.tableName).where(fields).first();
        });
    }
    /**
     * Get a single record matching multiple fields.
     * @param fields - Key-value pairs representing query conditions.
     * @returns A Promise resolving to the first matching record, or undefined if not found.
     */
    getByFields(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)(this.tableName).where(fields).first();
        });
    }
    /**
     * Get all records matching given fields.
     * @param fields - Key-value pairs representing query conditions.
     * @returns A Promise resolving to an array of matching records.
     */
    getAllByFields(fields) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)(this.tableName).where(fields);
        });
    }
    /**
     * Update records where a specific field matches a value.
     * @param field - Field to match.
     * @param value - Value to match.
     * @param data - Partial object of new data to apply.
     * @returns A Promise resolving to the number of affected rows.
     */
    updateBy(field, value, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)(this.tableName).where({ [field]: value }).update(data);
        });
    }
    /**
     * Delete records where a specific field matches a value.
     * @param field - Field to match.
     * @param value - Value to match.
     * @returns A Promise resolving to the number of deleted rows.
     */
    deleteBy(field, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, knex_1.default)(this.tableName).where({ [field]: value }).delete();
        });
    }
}
exports.BaseModel = BaseModel;
