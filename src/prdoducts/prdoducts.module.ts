import { Module } from '@nestjs/common';
import { PrdoductsService } from './prdoducts.service';
import { PrdoductsController } from './prdoducts.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Prdoduct, ProductImage } from './entities'

@Module({
  controllers: [PrdoductsController],
  providers: [PrdoductsService],
  imports: [TypeOrmModule.forFeature([Prdoduct, ProductImage])], 
  exports : [PrdoductsService,TypeOrmModule],
})

export class PrdoductsModule {}
