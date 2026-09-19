import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  async create(documentId: number, text: string) {
    return this.prisma.comment.create({
        data: {
            text,
            documentId,
        },
     });
    }
  
  async findAllByDocument(documentId: number) {
    return this.prisma.comment.findMany({
        where: { documentId,},
        orderBy: { date: 'desc' },
    });
  } 

}