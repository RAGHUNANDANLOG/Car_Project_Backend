import carModelRepository from '../repositories/carModelRepository.js';
import { toEntity, toViewModel, toViewModelList, toUpdateEntity } from '../dto/carModelDTO.js';
import { AppError } from '../middleware/errorHandler.js';
import logger from '../utils/logger.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Car Model Service
 * Business logic layer for car model operations
 */
class CarModelService {
  /**
   * Get all car models with pagination and filtering
   */
  async getAllCarModels(queryParams) {
    try {
      const options = {
        search: queryParams.search || '',
        sortBy: queryParams.sortBy || 'created_at',
        sortOrder: queryParams.sortOrder || 'desc',
        page: parseInt(queryParams.page, 10) || 1,
        limit: parseInt(queryParams.limit, 10) || 10,
        brand: queryParams.brand || null,
        carClass: queryParams.carClass || null,
        isActive: queryParams.isActive !== undefined ? queryParams.isActive === 'true' : null
      };

      const result = await carModelRepository.findAllWithImages(options);

      return {
        data: toViewModelList(result.data),
        pagination: result.pagination
      };
    } catch (error) {
      logger.error(`CarModelService getAllCarModels error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get car model by ID
   */
  async getCarModelById(id) {
    try {
      const carModel = await carModelRepository.findByIdWithImages(id);
      
      if (!carModel) {
        throw new AppError('Car model not found', 404);
      }

      return toViewModel(carModel);
    } catch (error) {
      logger.error(`CarModelService getCarModelById error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Create a new car model
   */
  async createCarModel(data, files) {
    try {
      // Check if model code already exists
      const existingModel = await carModelRepository.findOne({ 
        model_code: data.model_code?.toUpperCase() 
      });
      
      if (existingModel) {
        throw new AppError('Model code already exists', 409);
      }

      // Validate that at least one image is provided
      if (!files || files.length === 0) {
        throw new AppError('At least one image is required', 400);
      }

      // Convert to entity and create
      const entity = toEntity(data);
      const result = await carModelRepository.createWithImages(entity, files);

      logger.info(`Car model created: ${result.model_code}`);
      return toViewModel(result);
    } catch (error) {
      // Clean up uploaded files if creation fails
      if (files && files.length > 0) {
        for (const file of files) {
          try {
            await fs.unlink(file.path);
          } catch (unlinkError) {
            logger.warn(`Failed to delete file: ${file.path}`);
          }
        }
      }
      logger.error(`CarModelService createCarModel error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update a car model
   */
  async updateCarModel(id, data, files, deleteImageIds = []) {
    try {
      // Check if car model exists
      const existingCarModel = await carModelRepository.findById(id);
      if (!existingCarModel) {
        throw new AppError('Car model not found', 404);
      }

      // Check if new model code conflicts with another model
      if (data.model_code) {
        const conflictModel = await carModelRepository.findOne({ 
          model_code: data.model_code.toUpperCase() 
        });
        if (conflictModel && conflictModel.id !== parseInt(id)) {
          throw new AppError('Model code already exists', 409);
        }
      }

      // Convert to update entity
      const updateEntity = toUpdateEntity(data);

      // Parse deleteImageIds if it's a string
      const imageIdsToDelete = typeof deleteImageIds === 'string' 
        ? JSON.parse(deleteImageIds) 
        : deleteImageIds;

      const result = await carModelRepository.updateWithImages(
        id, 
        updateEntity, 
        files, 
        imageIdsToDelete
      );

      logger.info(`Car model updated: ${id}`);
      return toViewModel(result);
    } catch (error) {
      logger.error(`CarModelService updateCarModel error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Delete a car model
   */
  async deleteCarModel(id) {
    try {
      // Check if car model exists
      const existingCarModel = await carModelRepository.findById(id);
      if (!existingCarModel) {
        throw new AppError('Car model not found', 404);
      }

      // Delete and get filenames for cleanup
      const deletedFilenames = await carModelRepository.deleteWithImages(id);

      // Clean up image files
      const uploadDir = path.join(__dirname, '../../uploads/car-models');
      for (const filename of deletedFilenames) {
        try {
          await fs.unlink(path.join(uploadDir, filename));
        } catch (unlinkError) {
          logger.warn(`Failed to delete file: ${filename}`);
        }
      }

      logger.info(`Car model deleted: ${id}`);
      return { message: 'Car model deleted successfully' };
    } catch (error) {
      logger.error(`CarModelService deleteCarModel error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Set default image for a car model
   */
  async setDefaultImage(carModelId, imageId) {
    try {
      const carModel = await carModelRepository.findById(carModelId);
      if (!carModel) {
        throw new AppError('Car model not found', 404);
      }

      await carModelRepository.setDefaultImage(carModelId, imageId);

      return { message: 'Default image updated successfully' };
    } catch (error) {
      logger.error(`CarModelService setDefaultImage error: ${error.message}`);
      throw error;
    }
  }
}

export default new CarModelService();



