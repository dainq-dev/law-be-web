import { Controller, Get } from '@nestjs/common';

@Controller()
export class MainController {
  constructor() {}
  
  @Get('health')
  async healthCheck() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
