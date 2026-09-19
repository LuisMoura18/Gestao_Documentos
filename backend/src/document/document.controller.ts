import { Controller, Post, Get, Param, Body, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}

   @Post()
   @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
          callback(null, uniqueSuffix + extname(file.originalname));
        },
      }),
    }),
  )

  async create(
    @Body() body: { title: string; description?: string },
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.documentService.create({
        title: body.title,
        description: body.description,
        nameFile: file.filename
      });
  }

    @Get()
  async findAll() {
    return this.documentService.findAll();
  }

    @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.documentService.findOne(Number(id));
  }
}
