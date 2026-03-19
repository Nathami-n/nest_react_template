import { Injectable } from "@nestjs/common";
import { ThrottlerGuard } from "@nestjs/throttler";

/**
 * A drop-in replacement for NestJS's default ThrottlerGuard.
 *
 * The default guard tracks requests by IP address, which causes trouble for
 * server-to-server API calls because many merchants may share the same egress
 * IP (NAT, load balancer, cloud provider). This guard:
 *
 *   1. Uses the API key's database `id` as the throttle key when one is
 *      attached to the request (set by ApiKeyGuard for checkout endpoints).
 *      This gives every merchant their own independent rate-limit bucket.
 *
 *   2. Falls back to the remote IP for all other routes (dashboard, auth, etc.)
 *      where no API key is present.
 *
 * Registered as APP_GUARD in ThrottlerModule so it applies globally.
 */
@Injectable()
export class SmartThrottlerGuard extends ThrottlerGuard {
    protected async getTracker(req: Record<string, unknown>): Promise<string> {
        const apiKey = req["apiKey"] as { id?: string } | undefined;
        if (apiKey?.id) {
            return `api_key:${apiKey.id}`;
        }
        // Fall back to IP address for non-API-key routes
        const ips = req["ips"] as string[] | undefined;
        return ips?.[0] ?? (req["ip"] as string | undefined) ?? "unknown";
    }
}
