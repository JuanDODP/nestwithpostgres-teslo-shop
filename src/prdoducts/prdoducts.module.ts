import { Module } from '@nestjs/common';
import { PrdoductsService } from './prdoducts.service';
import { PrdoductsController } from './prdoducts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prdoduct } from './entities/prdoduct.entity';

@Module({
  controllers: [PrdoductsController],
  providers: [PrdoductsService],
  imports: [TypeOrmModule.forFeature([Prdoduct])], 
})

export class PrdoductsModule {}
