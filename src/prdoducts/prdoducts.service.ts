import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePrdoductDto } from './dto/create-prdoduct.dto';
import { UpdatePrdoductDto } from './dto/update-prdoduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Prdoduct } from './entities/prdoduct.entity';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'

@Injectable()
export class PrdoductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Prdoduct)
    private readonly prdoductRepository: Repository<Prdoduct>,
  ) { }
  async create(createPrdoductDto: CreatePrdoductDto) {
    try {
      const prdoduct = this.prdoductRepository.create(createPrdoductDto);
      await this.prdoductRepository.save(prdoduct);
      return prdoduct

    } catch (error) {

      this.handleDBExceptions(error);
    }
  }

  findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    return this.prdoductRepository.find({
      take: limit,
      skip: offset,
    });
  }

  async findOne(term: string) {
    let product: Prdoduct | null;
    if (isUUID(term)) {
      product = await this.prdoductRepository.findOneBy({ id: term });
    }
    else {
      const queryBuilder = this.prdoductRepository.createQueryBuilder('');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .getOne();
    }
    if (!product) {
      throw new BadRequestException(`Product with id ${term} not found`);
    }
    return product;
  }

  async update(id: string, updatePrdoductDto: UpdatePrdoductDto) {
    try {
      const prdoduct = await this.prdoductRepository.preload({
        id,
        ...updatePrdoductDto,
      });
      if (!prdoduct) {
        throw new BadRequestException(`Product with id ${id} not found`);
      }
      await this.prdoductRepository.save(prdoduct);
      return prdoduct;
    } catch (error) {
      this.handleDBExceptions(error);
    }
  }

  async remove(id: string) {
    const prdoduct = await this.findOne(id);
    if (!prdoduct) {
      throw new BadRequestException(`Product with id ${id} not found`);
    }
    return this.prdoductRepository.remove(prdoduct);
  }
  private handleDBExceptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(`Product exists ${error.detail}`);
    }
    this.logger.error(error);
    throw new InternalServerErrorException('Could not create product');
  }
}
