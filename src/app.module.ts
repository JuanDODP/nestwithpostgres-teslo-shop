import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrdoductsModule } from './prdoducts/prdoducts.module';
import { CommonModule } from './common/common.module';
import { SeedModule } from './seed/seed.module';


@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port:  5432,
      database: process.env.DB_NAME,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'example',
      autoLoadEntities: true,
      synchronize: true,
    }),
    PrdoductsModule,
    CommonModule,
    SeedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
