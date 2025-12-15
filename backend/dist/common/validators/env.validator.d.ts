declare enum Environment {
    Development = "development",
    Production = "production",
    Test = "test"
}
export declare class EnvironmentVariables {
    PORT: number;
    NODE_ENV: Environment;
    MONGODB_URI: string;
    JWT_SECRET: string;
    FRONTEND_URL: string;
}
export declare function validateEnv(config: Record<string, unknown>): EnvironmentVariables;
export {};
//# sourceMappingURL=env.validator.d.ts.map