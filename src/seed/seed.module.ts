import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedController } from './seed.controller';
import { PrdoductsModule } from 'src/prdoducts/prdoducts.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [SeedController],
  providers: [SeedService],
  imports: [PrdoductsModule, AuthModule],

})
export class SeedModule { }
