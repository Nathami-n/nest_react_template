import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { AppConfigService } from '../config/config.service';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor(private readonly config: AppConfigService) {
    const prismaAdapter = new PrismaPg({
      connectionString: config.databaseUrl
    });
    super({
      adapter: prismaAdapter
    });
    this.registerSoftDeleteMiddleware();
  }

  async onModuleInit() {
    await this.$connect();
  }

  enableShutdownHooks(app: any) {
    process.on('beforeExit', async () => {
      await app.close();
    });
  }

  /**
   * Register middleware to automatically filter out soft-deleted records
   * This applies to all findMany, findFirst, findUnique querieS
   * but NOT to count queries (to maintain accurate pagination)
   */
  private registerSoftDeleteMiddleware() {
    // Check if $use method is available (not available in some testing environments)
    if (typeof (this as any).$use !== 'function') {
      return;
    }

    (this as any).$use(async (params: any, next: any) => {
      // Only apply to models that have deletedAt field
      const modelsWithSoftDelete = [
        'user',
      ];

      if (modelsWithSoftDelete.includes(params.model?.toLowerCase() || '')) {
        params.args = params.args || {};

        // For findUnique, findFirst, findMany - exclude soft-deleted records
        if (params.action === 'findUnique' || params.action === 'findFirst') {
          // Add deletedAt: null to where clause
          params.args.where = params.args.where || {};
          if (params.args.where.deletedAt === undefined) {
            params.args.where.deletedAt = null;
          }
        }

        if (params.action === 'findMany') {
          // Add deletedAt: null to where clause if not explicitly set
          params.args.where = params.args.where || {};
          if (params.args.where.deletedAt === undefined) {
            params.args.where.deletedAt = null;
          }
        }

        // For update and delete operations, ensure we don't operate on soft-deleted records
        if (params.action === 'update' || params.action === 'delete') {
          params.args.where = params.args.where || {};
          if (params.args.where.deletedAt === undefined) {
            params.args.where.deletedAt = null;
          }
        }

        // Convert delete to update (set deletedAt)
        if (params.action === 'delete') {
          params.action = 'update';
          params.args.data = { deletedAt: new Date() };
        }

        if (params.action === 'deleteMany') {
          params.action = 'updateMany';
          params.args.data = { deletedAt: new Date() };
        }
      }

      return next(params);
    });
  }
}
