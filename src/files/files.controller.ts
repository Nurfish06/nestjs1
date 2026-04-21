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
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req, file, callback) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
        return callback(new BadRequestException('Only images and pdf files are allowed!'), false);
      }
      callback(null, true);
    },
  }))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    // Mock Malware Scan
    const isSafe = await this.mockMalwareScan(file.path);
    if (!isSafe) {
      // In a real app, delete the file if malware is found
      throw new BadRequestException('Malware detected in file!');
    }

    return {
      message: 'File uploaded successfully and scanned',
      filename: file.filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
    };
  }

  private async mockMalwareScan(filePath: string): Promise<boolean> {
    // Placeholder for actual malware scanning logic (e.g., using ClamAV)
    console.log(`Scanning file: ${filePath} for malware...`);
    return new Promise((resolve) => setTimeout(() => resolve(true), 500));
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
