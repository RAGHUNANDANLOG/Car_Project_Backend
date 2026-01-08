import { Router } from 'express';
import carModelController from '../controllers/carModelController.js';
import { carModelValidators } from '../middleware/validators.js';
import { uploadImages } from '../middleware/upload.js';

const router = Router();

/**
 * Car Model Routes
 * All routes are prefixed with /api/car-models
 */

// GET /api/car-models - Get all car models with pagination
router.get('/', 
  carModelValidators.list, 
  carModelController.getAll.bind(carModelController)
);

// GET /api/car-models/:id - Get car model by ID
router.get('/:id', 
  carModelValidators.getById, 
  carModelController.getById.bind(carModelController)
);

// POST /api/car-models - Create new car model
router.post('/', 
  uploadImages.array('images', 10),
  carModelValidators.create, 
  carModelController.create.bind(carModelController)
);

// PUT /api/car-models/:id - Update car model
router.put('/:id', 
  uploadImages.array('images', 10),
  carModelValidators.update, 
  carModelController.update.bind(carModelController)
);

// DELETE /api/car-models/:id - Delete car model
router.delete('/:id', 
  carModelValidators.getById, 
  carModelController.delete.bind(carModelController)
);

// PATCH /api/car-models/:id/default-image/:imageId - Set default image
router.patch('/:id/default-image/:imageId', 
  carModelController.setDefaultImage.bind(carModelController)
);

export default router;



