import BaseRepository from './baseRepository.js';
import db from '../config/database.js';
import logger from '../utils/logger.js';

/**
 * Car Model Repository
 * Extends BaseRepository with car model specific queries
 */
class CarModelRepository extends BaseRepository {
  constructor() {
    super('car_models');
  }

  /**
   * Find all car models with images and search/sort/pagination
   */
  async findAllWithImages(options = {}) {
    try {
      const {
        search = '',
        sortBy = 'created_at',
        sortOrder = 'desc',
        page = 1,
        limit = 10,
        brand = null,
        carClass = null,
        isActive = null
      } = options;

      const offset = (page - 1) * limit;

      // Build count query separately (without complex selects)
      let countQuery = db('car_models as cm');

      // Apply filters to count query
      if (search) {
        countQuery = countQuery.where(function() {
          this.whereILike('cm.model_name', `%${search}%`)
            .orWhereILike('cm.model_code', `%${search}%`);
        });
      }
      if (brand) {
        countQuery = countQuery.where('cm.brand', brand);
      }
      if (carClass) {
        countQuery = countQuery.where('cm.car_class', carClass);
      }
      if (isActive !== null) {
        countQuery = countQuery.where('cm.is_active', isActive);
      }

      // Get total count for pagination
      const [{ count }] = await countQuery.count('cm.id as count');
      const totalItems = parseInt(count, 10);

      // Build main query with images subquery
      let query = db('car_models as cm')
        .select(
          'cm.*',
          db.raw(`(
            SELECT json_agg(json_build_object(
              'id', cmi.id,
              'filename', cmi.filename,
              'original_name', cmi.original_name,
              'path', cmi.path,
              'is_default', cmi.is_default
            ))
            FROM car_model_images cmi
            WHERE cmi.car_model_id = cm.id
          ) as images`)
        );

      // Apply search filter
      if (search) {
        query = query.where(function() {
          this.whereILike('cm.model_name', `%${search}%`)
            .orWhereILike('cm.model_code', `%${search}%`);
        });
      }

      // Apply brand filter
      if (brand) {
        query = query.where('cm.brand', brand);
      }

      // Apply class filter
      if (carClass) {
        query = query.where('cm.car_class', carClass);
      }

      // Apply active filter
      if (isActive !== null) {
        query = query.where('cm.is_active', isActive);
      }

      // Apply sorting
      const validSortColumns = ['date_of_manufacturing', 'sort_order', 'created_at', 'price', 'model_name'];
      const sortColumn = validSortColumns.includes(sortBy) ? sortBy : 'created_at';
      const sortDir = sortOrder.toLowerCase() === 'asc' ? 'asc' : 'desc';

      query = query.orderBy(`cm.${sortColumn}`, sortDir);

      // Apply pagination
      query = query.limit(limit).offset(offset);

      const results = await query;

      return {
        data: results,
        pagination: {
          page,
          limit,
          totalItems
        }
      };
    } catch (error) {
      logger.error(`CarModelRepository findAllWithImages error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Find car model by ID with images
   */
  async findByIdWithImages(id) {
    try {
      const carModel = await db('car_models').where({ id }).first();
      
      if (!carModel) return null;

      const images = await db('car_model_images')
        .where({ car_model_id: id })
        .orderBy('is_default', 'desc');

      return { ...carModel, images };
    } catch (error) {
      logger.error(`CarModelRepository findByIdWithImages error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create car model with images (transaction)
   */
  async createWithImages(carModelData, imageFiles) {
    const carModelId = await db.transaction(async (trx) => {
      // Insert car model
      const [carModel] = await trx('car_models')
        .insert(carModelData)
        .returning('*');

      // Insert images if provided
      if (imageFiles && imageFiles.length > 0) {
        const imageRecords = imageFiles.map((file, index) => ({
          car_model_id: carModel.id,
          filename: file.filename,
          original_name: file.originalname,
          mime_type: file.mimetype,
          file_size: file.size,
          path: `/uploads/car-models/${file.filename}`,
          is_default: index === 0 // First image is default
        }));

        await trx('car_model_images').insert(imageRecords);
      }

      return carModel.id;
    });

    // Fetch complete data after transaction commits
    return await this.findByIdWithImages(carModelId);
  }

  /**
   * Update car model with images (transaction)
   */
  async updateWithImages(id, carModelData, imageFiles, deleteImageIds = []) {
    await db.transaction(async (trx) => {
      // Update car model
      await trx('car_models')
        .where({ id })
        .update({ ...carModelData, updated_at: new Date() });

      // Delete specified images
      if (deleteImageIds.length > 0) {
        await trx('car_model_images')
          .whereIn('id', deleteImageIds)
          .andWhere('car_model_id', id)
          .del();
      }

      // Add new images if provided
      if (imageFiles && imageFiles.length > 0) {
        const existingImages = await trx('car_model_images')
          .where('car_model_id', id)
          .count('* as count');
        
        const hasExistingDefault = existingImages[0].count > 0;

        const imageRecords = imageFiles.map((file, index) => ({
          car_model_id: id,
          filename: file.filename,
          original_name: file.originalname,
          mime_type: file.mimetype,
          file_size: file.size,
          path: `/uploads/car-models/${file.filename}`,
          is_default: !hasExistingDefault && index === 0
        }));

        await trx('car_model_images').insert(imageRecords);
      }
    });

    // Fetch complete data after transaction commits
    return await this.findByIdWithImages(id);
  }

  /**
   * Set default image for car model
   */
  async setDefaultImage(carModelId, imageId) {
    return await db.transaction(async (trx) => {
      // Remove default from all images
      await trx('car_model_images')
        .where({ car_model_id: carModelId })
        .update({ is_default: false });

      // Set new default
      await trx('car_model_images')
        .where({ id: imageId, car_model_id: carModelId })
        .update({ is_default: true });

      return true;
    });
  }

  /**
   * Delete car model and all associated images
   */
  async deleteWithImages(id) {
    return await db.transaction(async (trx) => {
      // Get image files for cleanup
      const images = await trx('car_model_images')
        .where({ car_model_id: id })
        .select('filename');

      // Delete images from database (cascade will handle this, but explicit for clarity)
      await trx('car_model_images').where({ car_model_id: id }).del();

      // Delete car model
      await trx('car_models').where({ id }).del();

      return images.map(img => img.filename);
    });
  }
}

export default new CarModelRepository();

