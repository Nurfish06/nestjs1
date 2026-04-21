import { Controller, Post, UseInterceptors, UploadedFile, Get, Param, Res, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { ApiTags, ApiConsumes, ApiBody, ApiOperation } from '@nestjs/swagger';
import { Response } from 'express';
import { existsSync } from 'fs';
import { join } from 'path';

@ApiTags('files')
@Controller('files')
export class FilesController {
  
  @Post('upload')
  @ApiOperation({ summary: 'Upload a single file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        callback(null, `${file.fieldname}-${uniqueSuffix}${ext}`);
      },
    }),
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|pdf|docx|txt)$/)) {
        return callback(new BadRequestException('Only image, pdf, docx, and txt files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }
    return {
      message: 'File uploaded successfully',
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  @Get(':filename')
  @ApiOperation({ summary: 'Get an uploaded file' })
  getFile(@Param('filename') filename: string, @Res() res: Response) {
    const path = join(process.cwd(), 'uploads', filename);
    if (!existsSync(path)) {
      throw new BadRequestException('File not found');
    }
    return res.sendFile(path);
  }
}
