import logger from '../utils/logger.js';

/**
 * Custom Application Error class
 */
export class AppError extends Error {
  constructor(message, statusCode = 500, errors = null) {
    super(message);
    this.statusCode = statusCode;
    this.errors = errors;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Global Error Handler Middleware
 * Catches all errors and returns consistent error response
 */
export const errorHandler = (err, req, res, next) => {
  // Log the error
  logger.error(`Error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body
  });

  // Handle known operational errors
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      timestamp: new Date().toISOString()
    });
  }

  // Handle validation errors from express-validator
  if (err.array && typeof err.array === 'function') {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.array(),
      timestamp: new Date().toISOString()
    });
  }

  // Handle Multer errors (file upload)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({
      success: false,
      message: 'File size exceeds 5MB limit',
      timestamp: new Date().toISOString()
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Unexpected file field',
      timestamp: new Date().toISOString()
    });
  }

  // Handle PostgreSQL errors
  if (err.code === '23505') {
    return res.status(409).json({
      success: false,
      message: 'Duplicate entry. This record already exists.',
      timestamp: new Date().toISOString()
    });
  }

  if (err.code === '23503') {
    return res.status(400).json({
      success: false,
      message: 'Foreign key constraint violation',
      timestamp: new Date().toISOString()
    });
  }

  // Handle unknown errors
  const statusCode = err.statusCode || 500;
  const message = process.env.NODE_ENV === 'production' 
    ? 'Internal server error' 
    : err.message;

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    timestamp: new Date().toISOString()
  });
};

export default errorHandler;



