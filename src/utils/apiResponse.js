/**
 * Generic API Response Handler
 * Provides consistent response structure across all endpoints
 */

/**
 * Success response
 * @param {object} res - Express response object
 * @param {object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 */
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

/**
 * Error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {object} errors - Validation errors or additional error details
 */
export const errorResponse = (res, message = 'Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

/**
 * Paginated response
 * @param {object} res - Express response object
 * @param {array} data - Array of items
 * @param {object} pagination - Pagination info
 * @param {string} message - Success message
 */
export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      page: pagination.page,
      limit: pagination.limit,
      totalItems: pagination.totalItems,
      totalPages: Math.ceil(pagination.totalItems / pagination.limit),
      hasNextPage: pagination.page < Math.ceil(pagination.totalItems / pagination.limit),
      hasPrevPage: pagination.page > 1
    },
    timestamp: new Date().toISOString()
  });
};

export default { successResponse, errorResponse, paginatedResponse };



