import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello(): Record<string, any> {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
    };
  }
}
