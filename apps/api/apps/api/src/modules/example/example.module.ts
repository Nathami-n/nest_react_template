import { Module } from '@nestjs/common';
import { ExampleController } from '@api/modules/example/controllers/example.controller';
import { ExampleService } from '@api/modules/example/services/example.service';

@Module({
  controllers: [ExampleController],
  providers: [ExampleService],
  exports: [ExampleService],
})
export class ExampleModule { }
