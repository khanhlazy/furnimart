"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("tsconfig-paths/register");
const core_1 = require("@nestjs/core");
const seed_module_1 = require("./seed/seed.module");
const seed_service_1 = require("./seed/seed.service");
async function bootstrap() {
    try {
        const module = await core_1.NestFactory.createApplicationContext(seed_module_1.SeedModule);
        const seedService = module.get(seed_service_1.SeedService);
        await seedService.seed();
        await module.close();
        process.exit(0);
    }
    catch (err) {
        console.error('❌ Seed failed:', err.message);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=seed.js.map