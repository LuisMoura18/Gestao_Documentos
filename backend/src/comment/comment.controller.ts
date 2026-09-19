import { Controller, Post, Get, Param, Body } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('documents/:documentId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

    @Post()
    async create(
        @Param('documentId') documentId: string,
        @Body() body: { text: string },
    ) {
        return this.commentService.create(Number(documentId), body.text);
    }

    @Get()
    async findAll(@Param('documentId') documentId: string) {
        return this.commentService.findAllByDocument(Number(documentId));
    }
}