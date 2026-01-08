import { encrypt, decrypt } from '../utils/encryption.js';

/**
 * Car Model Data Transfer Objects
 * Handles conversion between DB entities and API view models
 * Includes encryption/decryption of sensitive fields
 */

/**
 * Convert request body to database entity
 * @param {object} requestBody - API request body
 * @returns {object} - Database entity
 */
export const toEntity = (requestBody) => {
  const entity = {
    brand: requestBody.brand,
    car_class: requestBody.car_class,
    model_name: requestBody.model_name,
    model_code: requestBody.model_code?.toUpperCase(),
    // Encrypt sensitive/rich-text fields
    description: encrypt(requestBody.description),
    features: encrypt(requestBody.features),
    price: parseFloat(requestBody.price),
    date_of_manufacturing: new Date(requestBody.date_of_manufacturing),
    is_active: requestBody.is_active !== undefined ? requestBody.is_active : true,
    sort_order: requestBody.sort_order !== undefined ? parseInt(requestBody.sort_order, 10) : 0
  };

  // Remove undefined values
  Object.keys(entity).forEach(key => {
    if (entity[key] === undefined) {
      delete entity[key];
    }
  });

  return entity;
};

/**
 * Convert database entity to API view model
 * @param {object} entity - Database entity
 * @returns {object} - API view model
 */
export const toViewModel = (entity) => {
  if (!entity) return null;

  return {
    id: entity.id,
    brand: entity.brand,
    carClass: entity.car_class,
    modelName: entity.model_name,
    modelCode: entity.model_code,
    // Decrypt sensitive/rich-text fields
    description: decrypt(entity.description) || entity.description,
    features: decrypt(entity.features) || entity.features,
    price: parseFloat(entity.price),
    dateOfManufacturing: entity.date_of_manufacturing,
    isActive: entity.is_active,
    sortOrder: entity.sort_order,
    images: entity.images ? entity.images.map(img => ({
      id: img.id,
      filename: img.filename,
      originalName: img.original_name,
      path: img.path,
      isDefault: img.is_default
    })) : [],
    defaultImage: entity.images?.find(img => img.is_default)?.path || 
                  (entity.images?.length > 0 ? entity.images[0].path : null),
    createdAt: entity.created_at,
    updatedAt: entity.updated_at
  };
};

/**
 * Convert array of entities to view models
 * @param {array} entities - Array of database entities
 * @returns {array} - Array of view models
 */
export const toViewModelList = (entities) => {
  return entities.map(toViewModel);
};

/**
 * Convert update request to entity (partial update)
 * @param {object} requestBody - API request body for update
 * @returns {object} - Partial database entity
 */
export const toUpdateEntity = (requestBody) => {
  const entity = {};

  if (requestBody.brand !== undefined) entity.brand = requestBody.brand;
  if (requestBody.car_class !== undefined) entity.car_class = requestBody.car_class;
  if (requestBody.model_name !== undefined) entity.model_name = requestBody.model_name;
  if (requestBody.model_code !== undefined) entity.model_code = requestBody.model_code.toUpperCase();
  if (requestBody.description !== undefined) entity.description = encrypt(requestBody.description);
  if (requestBody.features !== undefined) entity.features = encrypt(requestBody.features);
  if (requestBody.price !== undefined) entity.price = parseFloat(requestBody.price);
  if (requestBody.date_of_manufacturing !== undefined) {
    entity.date_of_manufacturing = new Date(requestBody.date_of_manufacturing);
  }
  if (requestBody.is_active !== undefined) entity.is_active = requestBody.is_active;
  if (requestBody.sort_order !== undefined) entity.sort_order = parseInt(requestBody.sort_order, 10);

  return entity;
};

export default {
  toEntity,
  toViewModel,
  toViewModelList,
  toUpdateEntity
};



