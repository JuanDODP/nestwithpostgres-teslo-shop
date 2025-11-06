import { Injectable } from '@nestjs/common';
import { PrdoductsService } from './../prdoducts/prdoducts.service';
import { initialData } from './data/seed-data';


@Injectable()
export class SeedService {
  constructor(private readonly productsService: PrdoductsService) {}
  async runSeed() {
    // Logic to seed the database
    await this.insertProducts();
    return { message: 'Database seeded successfully' };
  }
   private async insertProducts() {
   await this.productsService.deleteAllProducts();
   const products = initialData.products;
   const insertPromises: Promise<any>[] = [];
    products.forEach((product) => {
    insertPromises.push(this.productsService.create(product));
    });
    await Promise.all(insertPromises);
   return true
}
}
