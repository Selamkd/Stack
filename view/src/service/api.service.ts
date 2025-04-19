import logger from '../../../back/src/utils/logger';

export class APIService {
  static BASE_URL = 'http://localhost:3226/api';

  static async request(endpoint: string, options: RequestInit) {
    const url = `${this.BASE_URL}/${endpoint}`;

    if (!options.headers) {
      options.headers = {
        'Content-Type': 'application/json',
      };
    }
    try {
      const response = await fetch(url, options);

      let data;
      const contentType = response.headers.get('Content-Type') || '';
      if (contentType.includes('application/json')) {
        try {
          data = await response.json();
        } catch (jsonError) {
          console.error('Failed to parse JSON response', endpoint);
        }
      } else {
        console.error(
          'Unexpected Content-Type, expected application/json',
          endpoint
        );
      }

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
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
