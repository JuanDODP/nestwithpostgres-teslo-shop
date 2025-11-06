import { Injectable } from '@nestjs/common';


@Injectable()
export class SeedService {
  runSeed() {
    // Logic to seed the database
    return { message: 'Database seeded successfully' };
  }
}
