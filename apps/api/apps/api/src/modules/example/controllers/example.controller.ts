import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '@api/modules/auth/guards';
import { ExampleService } from '@api/modules/example/services/example.service';
import { CreateExampleDto, UpdateExampleDto } from '@api/modules/example/dto';
import type { Request } from 'express';

@ApiTags('Example')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller({ path: 'examples', version: '1' })
export class ExampleController {
  constructor(private readonly exampleService: ExampleService) { }

  @Get()
  @ApiOperation({ summary: 'Get all examples with pagination' })
  @ApiResponse({ status: 200, description: 'Returns paginated examples' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
  ) {
    return this.exampleService.findAll(page, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single example by ID' })
  @ApiResponse({ status: 200, description: 'Returns the example' })
  @ApiResponse({ status: 404, description: 'Example not found' })
  async findOne(@Param('id') id: string) {
    return this.exampleService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new example' })
  @ApiResponse({ status: 201, description: 'Example created successfully' })
  async create(@Body() dto: CreateExampleDto, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.exampleService.create(userId, dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing example' })
  @ApiResponse({ status: 200, description: 'Example updated successfully' })
  @ApiResponse({ status: 404, description: 'Example not found' })
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateExampleDto,
    @Req() req: Request,
  ) {
    const userId = (req.user as any).id;
    return this.exampleService.update(id, userId, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an example' })
  @ApiResponse({ status: 200, description: 'Example deleted successfully' })
  @ApiResponse({ status: 404, description: 'Example not found' })
  async delete(@Param('id') id: string, @Req() req: Request) {
    const userId = (req.user as any).id;
    return this.exampleService.delete(id, userId);
  }
}
