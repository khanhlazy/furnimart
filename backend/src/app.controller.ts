import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health')
@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'Root endpoint - API info' })
  root() {
    return {
      message: '🚀 FurniMart API Server',
      version: '1.0.0',
      docs: 'http://localhost:3001/api/docs',
      status: 'running',
      timestamp: new Date().toISOString(),
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  health() {
    return {
      status: 'UP',
      timestamp: new Date().toISOString(),
      message: '✅ FurniMart Backend is running',
    };
  }
}
