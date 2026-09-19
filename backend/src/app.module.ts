import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { DocumentModule } from './document/document.module';
import { CommentModule } from './comment/comment.module';

@Module({
  imports: [PrismaModule, DocumentModule, CommentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
