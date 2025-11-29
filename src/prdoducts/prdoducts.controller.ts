import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, NotFoundException, Query } from '@nestjs/common';
import { PrdoductsService } from './prdoducts.service';
import { CreatePrdoductDto } from './dto/create-prdoduct.dto';
import { UpdatePrdoductDto } from './dto/update-prdoduct.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';
import { Auth, GetUser } from '../auth/decorators';
import { ValidRoles } from '../auth/interface';
import { User } from '../auth/entities/user.entity';

@Controller('prdoducts')
export class PrdoductsController {
  constructor(private readonly prdoductsService: PrdoductsService) { }

  @Post()
  @Auth()
  create(
    @Body() createPrdoductDto: CreatePrdoductDto,
    @GetUser() user: User
  ) {
    return this.prdoductsService.create(createPrdoductDto, user);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log({ paginationDto })
    return this.prdoductsService.findAll(paginationDto);
  }
// arreglar el findOnePlain
  @Get(':term')
  async findOne(@Param('term',) term: string) {
    const prdoduct = await this.prdoductsService.findOnePlain(term);
    if (!prdoduct) {
      throw new NotFoundException(`Product with id ${term} not found`);
    }
    return prdoduct;
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePrdoductDto: UpdatePrdoductDto, @GetUser() user: User) {
    return this.prdoductsService.update(id, updatePrdoductDto, user);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.prdoductsService.remove(id);
  }
}
