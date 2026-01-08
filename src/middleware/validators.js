import { body, param, query, validationResult } from 'express-validator';
import { AppError } from './errorHandler.js';

// Valid options for dropdowns
const VALID_BRANDS = ['Audi', 'Jaguar', 'Land Rover', 'Renault'];
const VALID_CLASSES = ['A-Class', 'B-Class', 'C-Class'];

/**
 * Validation result handler
 */
export const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(err => ({
      field: err.path,
      message: err.msg
    }));
    throw new AppError('Validation failed', 400, formattedErrors);
  }
  next();
};

/**
 * Car Model Validators
 */
export const carModelValidators = {
  create: [
    body('brand')
      .notEmpty().withMessage('Brand is required')
      .isIn(VALID_BRANDS).withMessage(`Brand must be one of: ${VALID_BRANDS.join(', ')}`),
    
    body('car_class')
      .notEmpty().withMessage('Class is required')
      .isIn(VALID_CLASSES).withMessage(`Class must be one of: ${VALID_CLASSES.join(', ')}`),
    
    body('model_name')
      .notEmpty().withMessage('Model name is required')
      .isString().withMessage('Model name must be a string')
      .trim(),
    
    body('model_code')
      .notEmpty().withMessage('Model code is required')
      .isLength({ min: 10, max: 10 }).withMessage('Model code must be exactly 10 characters')
      .isAlphanumeric().withMessage('Model code must be alphanumeric'),
    
    body('description')
      .notEmpty().withMessage('Description is required'),
    
    body('features')
      .notEmpty().withMessage('Features is required'),
    
    body('price')
      .notEmpty().withMessage('Price is required')
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('date_of_manufacturing')
      .notEmpty().withMessage('Date of manufacturing is required')
      .isISO8601().withMessage('Invalid date format'),
    
    body('is_active')
      .optional()
      .isBoolean().withMessage('Active must be a boolean'),
    
    body('sort_order')
      .optional()
      .isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer'),
    
    validate
  ],

  update: [
    param('id')
      .isInt().withMessage('Invalid car model ID'),
    
    body('brand')
      .optional()
      .isIn(VALID_BRANDS).withMessage(`Brand must be one of: ${VALID_BRANDS.join(', ')}`),
    
    body('car_class')
      .optional()
      .isIn(VALID_CLASSES).withMessage(`Class must be one of: ${VALID_CLASSES.join(', ')}`),
    
    body('model_name')
      .optional()
      .isString().withMessage('Model name must be a string')
      .trim(),
    
    body('model_code')
      .optional()
      .isLength({ min: 10, max: 10 }).withMessage('Model code must be exactly 10 characters')
      .isAlphanumeric().withMessage('Model code must be alphanumeric'),
    
    body('price')
      .optional()
      .isFloat({ min: 0 }).withMessage('Price must be a positive number'),
    
    body('date_of_manufacturing')
      .optional()
      .isISO8601().withMessage('Invalid date format'),
    
    body('is_active')
      .optional()
      .isBoolean().withMessage('Active must be a boolean'),
    
    body('sort_order')
      .optional()
      .isInt({ min: 0 }).withMessage('Sort order must be a non-negative integer'),
    
    validate
  ],

  getById: [
    param('id')
      .isInt().withMessage('Invalid car model ID'),
    validate
  ],

  list: [
    query('page')
      .optional()
      .isInt({ min: 1 }).withMessage('Page must be a positive integer'),
    
    query('limit')
      .optional()
      .isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
    
    query('search')
      .optional()
      .isString().trim(),
    
    query('sortBy')
      .optional()
      .isIn(['date_of_manufacturing', 'sort_order', 'created_at'])
      .withMessage('Sort by must be: date_of_manufacturing, sort_order, or created_at'),
    
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc', 'ASC', 'DESC'])
      .withMessage('Sort order must be: asc or desc'),
    
    validate
  ]
};

/**
 * Commission Report Validators
 */
export const commissionValidators = {
  getReport: [
    query('salesman')
      .optional()
      .isString().trim(),
    
    query('brand')
      .optional()
      .isIn(VALID_BRANDS).withMessage(`Brand must be one of: ${VALID_BRANDS.join(', ')}`),
    
    query('sortBy')
      .optional()
      .isIn(['salesman', 'brand', 'total_commission'])
      .withMessage('Sort by must be: salesman, brand, or total_commission'),
    
    query('sortOrder')
      .optional()
      .isIn(['asc', 'desc', 'ASC', 'DESC'])
      .withMessage('Sort order must be: asc or desc'),
    
    validate
  ]
};

export default { carModelValidators, commissionValidators, validate };



