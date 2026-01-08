import carModelService from '../services/carModelService.js';
import { successResponse, paginatedResponse, errorResponse } from '../utils/apiResponse.js';
import logger from '../utils/logger.js';

/**
 * Car Model Controller
 * Handles HTTP requests for car model operations
 */
class CarModelController {
  /**
   * Get all car models
   * GET /api/car-models
   */
  async getAll(req, res, next) {
    try {
      const result = await carModelService.getAllCarModels(req.query);
      
      return paginatedResponse(
        res,
        result.data,
        result.pagination,
        'Car models retrieved successfully'
      );
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get car model by ID
   * GET /api/car-models/:id
   */
  async getById(req, res, next) {
    try {
      const carModel = await carModelService.getCarModelById(req.params.id);
      
      return successResponse(res, carModel, 'Car model retrieved successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Create a new car model
   * POST /api/car-models
   */
  async create(req, res, next) {
    try {
      const carModel = await carModelService.createCarModel(req.body, req.files);
      
      return successResponse(res, carModel, 'Car model created successfully', 201);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Update a car model
   * PUT /api/car-models/:id
   */
  async update(req, res, next) {
    try {
      const deleteImageIds = req.body.deleteImageIds || [];
      const carModel = await carModelService.updateCarModel(
        req.params.id,
        req.body,
        req.files,
        deleteImageIds
      );
      
      return successResponse(res, carModel, 'Car model updated successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a car model
   * DELETE /api/car-models/:id
   */
  async delete(req, res, next) {
    try {
      await carModelService.deleteCarModel(req.params.id);
      
      return successResponse(res, null, 'Car model deleted successfully');
    } catch (error) {
      next(error);
    }
  }

  /**
   * Set default image
   * PATCH /api/car-models/:id/default-image/:imageId
   */
  async setDefaultImage(req, res, next) {
    try {
      await carModelService.setDefaultImage(req.params.id, req.params.imageId);
      
      return successResponse(res, null, 'Default image updated successfully');
    } catch (error) {
      next(error);
    }
  }
}

export default new CarModelController();



