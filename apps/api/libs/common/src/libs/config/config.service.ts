import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

@Injectable()
export class AppConfigService {
    constructor(private config: ConfigService) { }

    // Generic getter for any config value
    get<T = string>(key: string): T | undefined {
        return this.config.get<T>(key);
    }

    // ============================================
    // APP CONFIG
    // ============================================

    get nodeEnv(): string {
        return this.config.get<string>("NODE_ENV", "development");
    }

    get isDevelopment(): boolean {
        return this.nodeEnv === "development";
    }

    get isProduction(): boolean {
        return this.nodeEnv === "production";
    }
    get isSandbox(): boolean {
return this.nodeEnv === "sandbox";
    }

    get port(): number {
        return this.config.get<number>("PORT", 5002);
    }

    get appName(): string {
        return this.config.get<string>("APP_NAME", "CITAPAY API");
    }

    get logLevel(): string {
        return this.config.get<string>("LOG_LEVEL", "debug");
    }

    get frontendUrl(): string {
        return this.config.get<string>("FRONTEND_URL", "http://localhost:5173");
    }

    get corsOrigins(): string[] {
        const origins = this.config.get<string>("CORS_ORIGINS", "http://localhost:3000,http://localhost:5173,https://pay.citatech.cloud");
        return origins.split(',').map(origin => origin.trim()).filter(Boolean);
    }

    // ============================================
    // DATABASE
    // ============================================

    get databaseUrl(): string {
        return this.config.getOrThrow<string>("DATABASE_URL");
    }

    // ============================================
    // JWT CONFIG
    // ============================================

    get jwtSecret(): string {
        return this.config.getOrThrow<string>("JWT_SECRET");
    }

    get jwtExpiration(): number {
        return this.config.get<number>("JWT_EXPIRATION", 3600); // 1 hour in seconds
    }

    get jwtRefreshExpiration(): number {
        return this.config.get<number>("JWT_REFRESH_EXPIRATION", 604800); // 7 days in seconds
    }

    get jwtRefreshExpirationDays(): number {
        // Convert seconds to days
        return Math.floor(this.jwtRefreshExpiration / 86400);
    }

    get jwtRefreshExpirationMs(): number {
        // Convert seconds to milliseconds
        return this.jwtRefreshExpiration * 1000;
    }


    // ============================================
    // GOOGLE OAUTH
    // ============================================

    get googleClientId(): string | undefined {
        return this.config.get<string>("GOOGLE_CLIENT_ID");
    }

    get googleClientSecret(): string | undefined {
        return this.config.get<string>("GOOGLE_CLIENT_SECRET");
    }

    get googleCallbackUrl(): string | undefined {
        return this.config.get<string>("GOOGLE_CALLBACK_URL");
    }

    get isGoogleOAuthConfigured(): boolean {
        return !!(this.googleClientId && this.googleClientSecret && this.googleCallbackUrl);
    }


    get apiUrl(): string {
        return this.config.get<string>("API_URL", `http://localhost:${this.port}`);
    }

    // ============================================
    // REDIS
    // ============================================

    get redisUrl(): string {
        return this.config.get<string>("REDIS_URL", "redis://localhost:6380");
    }

    get redisHost(): string {
        const url = new URL(this.redisUrl);
        return url.hostname;
    }

    get redisPort(): number {
        const url = new URL(this.redisUrl);
        return parseInt(url.port || '6379', 10);
    }

    get redisPassword(): string | undefined {
        // First try explicit REDIS_PASSWORD env var (recommended for production)
        const explicitPassword = this.config.get<string>('REDIS_PASSWORD');
        if (explicitPassword) {
            return explicitPassword;
        }

        // Fall back to parsing from REDIS_URL if password is embedded
        const url = new URL(this.redisUrl);
        return url.password || undefined;
    }

    get redisConfig() {
        return {
            url: this.redisUrl,
            host: this.redisHost,
            port: this.redisPort,
            password: this.redisPassword,
        };
    }

    // ============================================
    // EMAIL CONFIG
    // ============================================

    get mailFrom(): string {
        return this.config.get<string>("MAIL_FROM", "noreply@pay.citatech.cloud");
    }

    get mailFromName(): string {
        return this.config.get<string>("MAIL_FROM_NAME", "CitaPay");
    }

    get mailhogHost(): string {
        return this.config.get<string>("MAILHOG_HOST", "localhost");
    }

    get mailhogPort(): number {
        return this.config.get<number>("MAILHOG_PORT", 1026);
    }

    get resendApiKey(): string | undefined {
        return this.config.get<string>("RESEND_API_KEY");
    }

    get isResendConfigured(): boolean {
        return !!this.resendApiKey && this.isProduction;
    }

    // ============================================
    // THROTTLING
    // ============================================

    get throttleShortTtl(): number {
        return this.config.get<number>("THROTTLE_SHORT_TTL", 1000);
    }

    get throttleShortLimit(): number {
        return this.config.get<number>("THROTTLE_SHORT_LIMIT", 3);
    }

    get throttleMediumTtl(): number {
        return this.config.get<number>("THROTTLE_MEDIUM_TTL", 10000);
    }

    get throttleMediumLimit(): number {
        return this.config.get<number>("THROTTLE_MEDIUM_LIMIT", 20);
    }

    get throttleLongTtl(): number {
        return this.config.get<number>("THROTTLE_LONG_TTL", 60000);
    }

    get throttleLongLimit(): number {
        return this.config.get<number>("THROTTLE_LONG_LIMIT", 100);
    }

    get jwtConfig() {
        return {
            secret: this.jwtSecret,
            expiration: this.jwtExpiration,
            refreshExpiration: this.jwtRefreshExpiration,
            refreshExpirationDays: this.jwtRefreshExpirationDays,
            refreshExpirationMs: this.jwtRefreshExpirationMs,
        };
    }

    get googleOAuthConfig() {
        return {
            clientId: this.googleClientId,
            clientSecret: this.googleClientSecret,
            callbackUrl: this.googleCallbackUrl,
            isConfigured: this.isGoogleOAuthConfigured,
        };
    }

    get throttleConfig() {
        return {
            short: { ttl: this.throttleShortTtl, limit: this.throttleShortLimit },
            medium: { ttl: this.throttleMediumTtl, limit: this.throttleMediumLimit },
            long: { ttl: this.throttleLongTtl, limit: this.throttleLongLimit },
        };
    }

    get emailConfig() {
        return {
            from: this.mailFrom,
            fromName: this.mailFromName,
            mailhog: {
                host: this.mailhogHost,
                port: this.mailhogPort,
            },
            resend: {
                apiKey: this.resendApiKey,
                isConfigured: this.isResendConfigured,
            },
            isProduction: this.isProduction,
        };
    }
}
