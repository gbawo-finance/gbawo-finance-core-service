import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getWelcome() {
    return {
      name: 'Gbawo Finance Core Service',
      version: '1.0.0',
      description: 'Core financial services API for the Gbawo Finance platform',
      endpoints: {
        health: '/health',
        documentation: '/api/docs',
        api: '/api/v1',
      },
      timestamp: new Date().toISOString(),
    };
  }
}
