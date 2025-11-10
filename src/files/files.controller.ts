import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors  } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { fileFilter } from './helpers/fileFilter.helper';


@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {    
    fileFilter,
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    console.log({ fileInController: file });
    if (!file) {
      throw new BadRequestException('File is not valid');
    }
    
    return {
      file: file.originalname,
    }
  }

}
