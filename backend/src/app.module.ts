import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { DocumentModule } from './document/document.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [PrismaModule, DocumentModule, CommentModule],
})
export class AppModule {}
