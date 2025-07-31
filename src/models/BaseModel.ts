import db from '../db/knex';

/**
 * BaseModel provides reusable methods for interacting with a database table.
 * It is a generic class, allowing type-safe operations for any data model.
 *
 * @template T - The schema/interface representing the table's data structure.
 */
export class BaseModel<T> {
  /** Name of the table this model interacts with */
  protected tableName: string;

  /**
   * Constructs a new BaseModel instance for a specific table.
   * @param tableName - The name of the database table.
   */
  constructor(tableName: string) {
    this.tableName = tableName;
  }

  /**
   * Insert a new record into the table.
   * @param data - Partial data object of type T to insert.
   * @returns A Promise resolving to the inserted row ID(s).
   */
  async add(data: Partial<T>) {
    return db(this.tableName).insert(data);
  }

  /**
   * Get a single record by one or more fields.
    * @param fields - Key-value pairs representing query conditions.
    * @returns A Promise resolving to the first matching record, or undefined if not found.
    */
   async getBy(fields: Partial<T>) {
    return db(this.tableName).where(fields).first();
  }

  /**
   * Get a single record matching multiple fields.
   * @param fields - Key-value pairs representing query conditions.
   * @returns A Promise resolving to the first matching record, or undefined if not found.
   */
  async getByFields(fields: Partial<T>) {
    return db(this.tableName).where(fields).first();
  }

  /**
   * Get all records matching given fields.
   * @param fields - Key-value pairs representing query conditions.
   * @returns A Promise resolving to an array of matching records.
   */
  async getAllByFields(fields: Partial<T>) {
    return db(this.tableName).where(fields);
  }

  /**
   * Update records where a specific field matches a value.
   * @param field - Field to match.
   * @param value - Value to match.
   * @param data - Partial object of new data to apply.
   * @returns A Promise resolving to the number of affected rows.
   */
  async updateBy(field: keyof T, value: any, data: Partial<T>) {
    return db(this.tableName).where({ [field]: value }).update(data);
  }

  /**
   * Delete records where a specific field matches a value.
   * @param field - Field to match.
   * @param value - Value to match.
   * @returns A Promise resolving to the number of deleted rows.
   */
  async deleteBy(field: keyof T, value: any) {
    return db(this.tableName).where({ [field]: value }).delete();
  }
}

