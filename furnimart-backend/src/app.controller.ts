import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('health')
  health() {
    return {
      ok: true,
      version: '1.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}
