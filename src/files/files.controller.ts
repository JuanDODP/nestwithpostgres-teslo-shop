import { BadRequestException, Controller, Get, Param, Post, Res, UploadedFile, UseInterceptors  } from '@nestjs/common';
import { FilesService } from './files.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { fileFilter, fileNamer } from './helpers';
import { Response } from 'express';
import { ConfigService } from '@nestjs/config';
// import { ConfigService } from '@nestjs/config';


@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
     private readonly configService: ConfigService,
  ) {}
  // Obtener imagen de producto
  @Get('product/:imageName')
  findProductImage(@Res() res:any,
   @Param('imageName') imageName: string,  ) {
    const path = this.filesService.getStaticProductImage(imageName);
    // res.status(403).json({ok:false, path})
     // colocar url de la imagen
    // const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
     res.sendFile(path);
     return path ; 
  }
  // subir un producto
  @Post('product')
  @UseInterceptors(FileInterceptor('file', {    
    fileFilter,
    storage:diskStorage({ 
      destination:'./static/products',
       filename:fileNamer
    })
  }))
  uploadProductImage(@UploadedFile() file: Express.Multer.File) {
    console.log({ fileInController: file });
    if (!file) {
      throw new BadRequestException('File is not valid');
    }
    const secureUrl = `${this.configService.get('HOST_API')}/files/product/${file.filename}`;
    
    return {
    secureUrl
    }
  }

}
