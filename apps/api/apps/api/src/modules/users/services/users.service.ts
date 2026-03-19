import { PrismaService, LoggerService, PaginatedResponseDto, buildPaginationMeta } from '@app/common';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(UsersService.name);
  }

  async findAll(page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          emailVerified: true,
          phoneVerified: true,
          isActive: true,
          provider: true,
          image: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
        skip,
        take: limit,
      }),
      this.prisma.user.count(),
    ]);

    return new PaginatedResponseDto(
      users,
      buildPaginationMeta({ page, limit, total }),
    );
  }

  async findOne(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        phoneVerified: true,
        isActive: true,
        provider: true,
        image: true,
        phone: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateUserStatus(id: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id },
      data: { isActive },
    });
  }
}
