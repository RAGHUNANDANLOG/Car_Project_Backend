import db from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Base Repository Class
 * Provides generic CRUD operations with parameterized queries
 * to prevent SQL injection
 */
class BaseRepository {
  constructor(tableName) {
    this.tableName = tableName;
    this.db = db;
  }

  /**
   * Find all records with optional filtering and pagination
   * @param {object} options - Query options
   */
  async findAll(options = {}) {
    try {
      const {
        where = {},
        orderBy = 'created_at',
        orderDir = 'desc',
        limit = 10,
        offset = 0,
        select = '*'
      } = options;

      let query = this.db(this.tableName).select(select);

      // Apply where conditions (parameterized - prevents SQL injection)
      Object.entries(where).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          query = query.where(key, value);
        }
      });

      // Apply ordering and pagination
      query = query.orderBy(orderBy, orderDir).limit(limit).offset(offset);

      const results = await query;
      return results;
    } catch (error) {
      logger.error(`Repository findAll error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find a single record by ID
   * @param {number} id - Record ID
   */
  async findById(id) {
    try {
      const result = await this.db(this.tableName).where({ id }).first();
      return result || null;
    } catch (error) {
      logger.error(`Repository findById error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find records matching conditions
   * @param {object} conditions - Where conditions
   */
  async findWhere(conditions) {
    try {
      const results = await this.db(this.tableName).where(conditions);
      return results;
    } catch (error) {
      logger.error(`Repository findWhere error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find a single record matching conditions
   * @param {object} conditions - Where conditions
   */
  async findOne(conditions) {
    try {
      const result = await this.db(this.tableName).where(conditions).first();
      return result || null;
    } catch (error) {
      logger.error(`Repository findOne error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new record
   * @param {object} data - Record data
   */
  async create(data) {
    try {
      const [result] = await this.db(this.tableName).insert(data).returning('*');
      return result;
    } catch (error) {
      logger.error(`Repository create error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create multiple records
   * @param {array} dataArray - Array of record data
   */
  async createMany(dataArray) {
    try {
      const results = await this.db(this.tableName).insert(dataArray).returning('*');
      return results;
    } catch (error) {
      logger.error(`Repository createMany error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a record by ID
   * @param {number} id - Record ID
   * @param {object} data - Update data
   */
  async update(id, data) {
    try {
      const [result] = await this.db(this.tableName)
        .where({ id })
        .update({ ...data, updated_at: new Date() })
        .returning('*');
      return result || null;
    } catch (error) {
      logger.error(`Repository update error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a record by ID
   * @param {number} id - Record ID
   */
  async delete(id) {
    try {
      const deleted = await this.db(this.tableName).where({ id }).del();
      return deleted > 0;
    } catch (error) {
      logger.error(`Repository delete error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Count records with optional conditions
   * @param {object} conditions - Where conditions
   */
  async count(conditions = {}) {
    try {
      const [{ count }] = await this.db(this.tableName)
        .where(conditions)
        .count('* as count');
      return parseInt(count, 10);
    } catch (error) {
      logger.error(`Repository count error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Execute raw SQL query (parameterized)
   * @param {string} sql - SQL query with placeholders
   * @param {array} bindings - Parameter bindings
   */
  async raw(sql, bindings = []) {
    try {
      const result = await this.db.raw(sql, bindings);
      return result.rows;
    } catch (error) {
      logger.error(`Repository raw query error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Begin a transaction
   */
  async transaction(callback) {
    try {
      return await this.db.transaction(callback);
    } catch (error) {
      logger.error(`Repository transaction error: ${error.message}`);
      throw error;
    }
  }
}

export default BaseRepository;



