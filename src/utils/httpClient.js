import axios from 'axios';
import logger from './logger.js';

/**
 * Generic HTTP Client for calling external REST APIs
 * Implements reusable patterns with proper error handling
 */
class HttpClient {
  constructor(baseURL = '', defaultHeaders = {}) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
        ...defaultHeaders
      },
      timeout: 30000 // 30 seconds default timeout
    });

    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`HTTP Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('HTTP Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`HTTP Response: ${response.status} ${response.config.url}`);
        return response;
      },
      (error) => {
        logger.error('HTTP Response Error:', error.message);
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle and format HTTP errors
   */
  handleError(error) {
    const formattedError = {
      message: error.message,
      status: error.response?.status || 500,
      data: error.response?.data || null,
      isNetworkError: !error.response
    };
    return formattedError;
  }

  /**
   * Generic GET request
   * @param {string} url - Endpoint URL
   * @param {object} params - Query parameters
   * @param {object} headers - Additional headers
   */
  async get(url, params = {}, headers = {}) {
    try {
      const response = await this.client.get(url, { params, headers });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Generic POST request
   * @param {string} url - Endpoint URL
   * @param {object} data - Request body
   * @param {object} headers - Additional headers
   */
  async post(url, data = {}, headers = {}) {
    try {
      const response = await this.client.post(url, data, { headers });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Generic PUT request
   * @param {string} url - Endpoint URL
   * @param {object} data - Request body
   * @param {object} headers - Additional headers
   */
  async put(url, data = {}, headers = {}) {
    try {
      const response = await this.client.put(url, data, { headers });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Generic PATCH request
   * @param {string} url - Endpoint URL
   * @param {object} data - Request body
   * @param {object} headers - Additional headers
   */
  async patch(url, data = {}, headers = {}) {
    try {
      const response = await this.client.patch(url, data, { headers });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { success: false, error };
    }
  }

  /**
   * Generic DELETE request
   * @param {string} url - Endpoint URL
   * @param {object} headers - Additional headers
   */
  async delete(url, headers = {}) {
    try {
      const response = await this.client.delete(url, { headers });
      return { success: true, data: response.data, status: response.status };
    } catch (error) {
      return { success: false, error };
    }
  }
}

// Export singleton instance and class for custom instances
export const httpClient = new HttpClient();
export default HttpClient;



