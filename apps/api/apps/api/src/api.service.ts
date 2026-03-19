import { Injectable } from '@nestjs/common';

@Injectable()
export class ApiService {
    getHealth() {
        return {
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }
}
