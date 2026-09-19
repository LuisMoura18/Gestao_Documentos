import { Controller, Post, Get, Param, Body, UploadedFile, UseInterceptors, Res, BadRequestException, } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { DocumentService } from './document.service';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import type { Response } from 'express';

@Controller('documents')
export class DocumentController {
    constructor(private readonly documentService: DocumentService) {}
  @Get(':id/download')
    async download(@Param('id') id: string, @Res() res: Response) {
      const document = await this.documentService.findOne(Number(id));
      if (!document) {
        return res.status(404).send('Documento não encontrado');
      }
      return res.sendFile(join(process.cwd(), 'uploads', document.nameFile)); 
  }
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
    if (!file) {
    throw new BadRequestException('É necessário enviar um arquivo.');
  }
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
