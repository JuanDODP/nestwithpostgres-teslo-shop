import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrdoductsModule } from 'src/prdoducts/prdoducts.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PrdoductsModule,],

})
export class SeedModule { }
