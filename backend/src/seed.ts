import 'tsconfig-paths/register';
import { NestFactory } from '@nestjs/core';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';

async function bootstrap() {
  try {
    const module = await NestFactory.createApplicationContext(SeedModule);
    const seedService = module.get(SeedService);
    await seedService.seed();
    await module.close();
    process.exit(0);
  } catch (err: any) {
    console.error('❌ Seed failed:', err.message);
    process.exit(1);
  }
}

bootstrap();
