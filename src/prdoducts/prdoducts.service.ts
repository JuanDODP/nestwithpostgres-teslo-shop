import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreatePrdoductDto } from './dto/create-prdoduct.dto';
import { UpdatePrdoductDto } from './dto/update-prdoduct.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { validate as isUUID } from 'uuid'
import { Prdoduct, ProductImage } from './entities';

@Injectable()
export class PrdoductsService {
  private readonly logger = new Logger('ProductsService');
  constructor(
    @InjectRepository(Prdoduct)
    private readonly prdoductRepository: Repository<Prdoduct>,
    @InjectRepository(ProductImage)
    private readonly prdoductImageRepository: Repository<ProductImage>,
  ) { }
  async create(createPrdoductDto: CreatePrdoductDto) {
    const { images = [], ...productDetails } = createPrdoductDto
    try {
      const prdoduct = this.prdoductRepository.create({
        ...productDetails,
        images: images.map(image => this.prdoductImageRepository.create({ url: image })),
      });
      await this.prdoductRepository.save(prdoduct);
      return {...prdoduct, images}

    } catch (error) {

      this.handleDBExceptions(error);
    }
  }

  async findAll(paginationDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginationDto;
    const products = await this.prdoductRepository.find({
      take: limit,
      skip: offset,
      relations:{
        images:true
      }
    });
    return products.map(product => ({
      ...product,
      images: product.images?.map((img) => img.url) ||[]
    }));
  }

  async findOne(term: string) {
    let product: Prdoduct | null;
    if (isUUID(term)) {
      product = await this.prdoductRepository.findOneBy({ id: term });
    }
    else {
      const queryBuilder = this.prdoductRepository.createQueryBuilder('prododuct');
      product = await queryBuilder
        .where('UPPER(title) =:title or slug =:slug', {
          title: term.toUpperCase(),
          slug: term.toLowerCase(),
        })
        .leftJoinAndSelect('prododuct.images', 'productImages')
        .getOne();
    }
    if (!product) {
      throw new BadRequestException(`Product with id ${term} not found`);
    }
    return product;
  }
  // nueva funcion para buscar y aplanar las imagenes
  async findOnePlain(term: string) {
    const {images=[], ...res} = await this.findOne(term);
    return {
      ...res,
      images: images?.map((img) => img.url) || []
    };
  }

  async update(id: string, updatePrdoductDto: UpdatePrdoductDto) {
    try {
      const prdoduct = await this.prdoductRepository.preload({
        id,
        ...updatePrdoductDto,
        images: []
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
