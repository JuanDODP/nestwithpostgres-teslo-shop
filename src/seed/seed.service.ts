import { Injectable } from '@nestjs/common';
import { PrdoductsService } from './../prdoducts/prdoducts.service';
import { initialData } from './data/seed-data';
import { User } from '../auth/entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';


@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: PrdoductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) { }
  async runSeed() {
    // Logic to seed the database
    await this.deleteTables();
    // antes de insrertar productos se insertan usuarios
    const adminUsers = await this.insertUsers();
    await this.insertProducts(adminUsers);
    return { message: 'Database seeded successfully' };
  }

  // ============================================================================
  // INSERTAR USUARIO 
  private async insertUsers() {
    const seedUsers = initialData.user;
    const users: User[] = [];
    seedUsers.forEach(user => {
      users.push(this.userRepository.create({
        ...user,
        password: bcrypt.hashSync(user.password, 10),
      }));
    });
    await this.userRepository.save(users);
    return users[0]; // retornar el primer usuario creado
  }



  // eliminar tablas de db y volver a insertar datos
  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const query = this.userRepository.createQueryBuilder();
    await query.delete().where({}).execute();
  }
  // ===========================================================================
  private async insertProducts(user: User) {
    await this.productsService.deleteAllProducts();
    const products = initialData.products;
    const insertPromises: Promise<any>[] = [];
    products.forEach((product) => {
      insertPromises.push(this.productsService.create(product, user));
    });
    await Promise.all(insertPromises);
    return true
  }
}
