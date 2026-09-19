import { Module } from '@nestjs/common';
import { DocumentController } from './document.controller';
import { DocumentService } from './document.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  controllers: [DocumentController],
  providers: [DocumentService],
  imports: [PrismaModule]
})
export class DocumentModule {}
