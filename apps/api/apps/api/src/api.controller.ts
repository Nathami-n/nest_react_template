import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiService } from '@api/api.service';

@ApiTags('Health')
@Controller()
export class ApiController {
    constructor(private readonly apiService: ApiService) { }

    @Get()
    @ApiOperation({ summary: 'Health check endpoint' })
    getHealth() {
        return this.apiService.getHealth();
    }
}
