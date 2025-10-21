import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, NotFoundException, Query } from '@nestjs/common';
import { PrdoductsService } from './prdoducts.service';
import { CreatePrdoductDto } from './dto/create-prdoduct.dto';
import { UpdatePrdoductDto } from './dto/update-prdoduct.dto';
import { PaginationDto } from '../common/dtos/pagination.dto';

@Controller('prdoducts')
export class PrdoductsController {
  constructor(private readonly prdoductsService: PrdoductsService) {}

  @Post()
  create(@Body() createPrdoductDto: CreatePrdoductDto) {
    return this.prdoductsService.create(createPrdoductDto);
  }

  @Get()
  findAll(@Query() paginationDto: PaginationDto) {
    console.log({paginationDto})
    return this.prdoductsService.findAll(paginationDto);
  }

  @Get(':term')
  async findOne(@Param('term', ) term: string) {
    const prdoduct = await this.prdoductsService.findOne(term);
    if(!prdoduct) {
     throw new NotFoundException(`Product with id ${term} not found`);
    }
    return prdoduct;
  }

  @Patch(':id')
  update(@Param('id', ParseUUIDPipe) id: string, @Body() updatePrdoductDto: UpdatePrdoductDto) {
    return this.prdoductsService.update(id, updatePrdoductDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.prdoductsService.remove( id);
  }
}
