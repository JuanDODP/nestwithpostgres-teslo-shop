import { PartialType } from '@nestjs/mapped-types';
import { CreatePrdoductDto } from './create-prdoduct.dto';

export class UpdatePrdoductDto extends PartialType(CreatePrdoductDto) {}
