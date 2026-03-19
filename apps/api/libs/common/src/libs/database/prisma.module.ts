
import { Module, Global } from '@nestjs/common';
import { PrismaService } from "@app/common/libs/database/prisma.service";

@Global()
@Module({
    providers: [PrismaService],
    exports: [PrismaService],
})
export class PrismaModule { }
