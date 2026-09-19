import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentService {
  constructor(private prisma: PrismaService) {}

  async create(data: {title: string, description?: string; nameFile: string}){
    return this.prisma.document.create({
        data: {
            title: data.title,
            description: data.description,
            nameFile: data.nameFile
        }
    });
  }
    
  async findAll() {
        return this.prisma.document.findMany({
            orderBy: {
                dataUpload: 'desc'
            }
        });
  }

    async findOne(id: number) {
        return this.prisma.document.findUnique({
            where: {id},
            include: { comments: true },
        });
    }

}
