import logger from '../../../back/src/utils/logger';

export class APIService {
  static baseUrl = '/api';

  static async request(endpoint: string, options: RequestInit) {
    const url = `${this.baseUrl}/${endpoint}`;

    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json',
      };
    }
    try {
      logger.debug(`APIService Request: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, options);

      let data = await response.json();

      if (!response.ok) {
        logger.error(
          `APIService Error: ${response.status} ${response.statusText} - ${url}`,
          data
        );
        throw new Error(data.message || 'API request failed');
      }

      logger.info(`APIService Success: ${options.method || 'GET'} ${url}`);
      return data;
    } catch (error) {
      logger.error(`APIService Request Failed: ${url}`, error);
      throw error;
    }
  }

  static async get(endpoint: string, params?: Record<string, string>) {
    let url = endpoint;

    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value);
        }
      });
      url = `${url}?${queryParams.toString()}`;
      logger.debug('APIService GET Request with params:', params);
    }

    return this.request(url, { method: 'GET' });
  }

  static async post(endpoint: string, data: any): Promise<any> {
    logger.debug('APIService POST Request data:', data);
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  static async patch(endpoint: string, data: any): Promise<any> {
    logger.debug('APIService PATCH Request data:', data);
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  static async delete(endpoint: string): Promise<any> {
    logger.debug('APIService DELETE Request:', endpoint);
    return this.request(endpoint, { method: 'DELETE' });
  }
}
export default APIService;
