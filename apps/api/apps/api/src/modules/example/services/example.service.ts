import { Injectable, NotFoundException } from '@nestjs/common';
import {
  PrismaService,
  LoggerService,
  PaginatedResponseDto,
  buildPaginationMeta,
} from '@app/common';
import { CreateExampleDto, UpdateExampleDto } from '@api/modules/example/dto';

@Injectable()
export class ExampleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(ExampleService.name);
  }

  /**
   * Get all examples with pagination
   */
  async findAll(page: number = 1, limit: number = 20) {
    // Example: This would query a database table
    // For now, returning mock data to show structure
    const mockData = [
      {
        id: '1',
        title: 'Example 1',
        description: 'This is an example item',
        createdAt: new Date(),
      },
      {
        id: '2',
        title: 'Example 2',
        description: 'Another example item',
        createdAt: new Date(),
      },
    ];

    const skip = (page - 1) * limit;
    const paginatedData = mockData.slice(skip, skip + limit);
    const total = mockData.length;

    return new PaginatedResponseDto(
      paginatedData,
      buildPaginationMeta({ page, limit, total }),
    );
  }

  /**
   * Get a single example by ID
   */
  async findOne(id: string) {
    // Example query (would use Prisma in real implementation)
    const example = {
      id,
      title: 'Example Item',
      description: 'This demonstrates a single item fetch',
      createdAt: new Date(),
    };

    if (!example) {
      throw new NotFoundException(`Example with ID ${id} not found`);
    }

    return example;
  }

  /**
   * Create a new example
   */
  async create(userId: string, dto: CreateExampleDto) {
    this.logger.log(`Creating example for user: ${userId}`);

    // In a real app, you'd create a database record:
    // const example = await this.prisma.example.create({
    //   data: {
    //     title: dto.title,
    //     description: dto.description,
    //     userId,
    //   },
    // });

    const example = {
      id: Math.random().toString(36),
      ...dto,
      userId,
      createdAt: new Date(),
    };

    return example;
  }

  /**
   * Update an existing example
   */
  async update(id: string, userId: string, dto: UpdateExampleDto) {
    this.logger.log(`Updating example ${id} for user: ${userId}`);

    // In a real app:
    // const example = await this.prisma.example.update({
    //   where: { id, userId }, // Ensure user owns the record
    //   data: dto,
    // });

    const example = {
      id,
      title: dto.title || 'Updated Example',
      description: dto.description,
      userId,
      updatedAt: new Date(),
    };

    return example;
  }

  /**
   * Delete an example
   */
  async delete(id: string, userId: string) {
    this.logger.log(`Deleting example ${id} for user: ${userId}`);

    // In a real app:
    // await this.prisma.example.delete({
    //   where: { id, userId },
    // });

    return { message: 'Example deleted successfully' };
  }
}
