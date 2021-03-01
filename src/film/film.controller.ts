import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { AddFileDto, AddFilmFromFileResDto, FilmReqDto } from './film.dto';
import { SuccessDelete, SuccessInsert } from '../app.dto';
import { FilmService } from './film.service';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  FileFieldsInterceptor,
  FileInterceptor,
} from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { EmptyFile } from '../http-error/empty-file';

@ApiTags('Film - admin panel')
@Controller('film')
// @ApiBearerAuth('Authorization')
// @UseGuards(AdminGuard)
export class FilmController {
  constructor(private service: FilmService) {}

  @Put('/')
  @ApiResponse({ status: 201, type: SuccessInsert, description: 'add film' })
  public addFilm(@Body() dto: FilmReqDto): Promise<SuccessInsert> {
    return this.service.addFilm(dto);
  }

  @Post('/upload-list-swagger-old/')
  @ApiExcludeEndpoint()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'upload list of films via swagger',
    type: AddFileDto,
    required: false,
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  public async addFromFileSwaggerOld(
    @UploadedFiles() files,
    @Body() dto: AddFileDto,
  ): Promise<SuccessInsert | AddFilmFromFileResDto> {
    const file: Express.Multer.File = (files?.file || [])[0];
    if (!file) throw new BadRequestException();
    // TODO I don't handle big files.
    const str = file.buffer.toString('utf-8').trim();
    return this.service.addFilmFromFile(str);
  }

  @Post('/upload-list-swagger/')
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        if (
          file.mimetype === 'text/plain' &&
          file.originalname.endsWith('.txt')
        ) {
          return callback(null, true);
        }
        callback(new ForbiddenException(), false);
      },
    }),
  )
  public async addFromFileSwagger(
    @UploadedFile() file,
    @Body() dto: AddFileDto,
  ): Promise<SuccessInsert | AddFilmFromFileResDto> {
    if (!file) throw new BadRequestException();
    if (!file.buffer.length) throw new EmptyFile();
    // TODO I don't handle big files.
    const str = file.buffer.toString().trim();
    return this.service.addFilmFromFile(str);
  }

  @Post('/upload-list/')
  @ApiResponse({
    status: 200,
    type: AddFilmFromFileResDto || SuccessInsert,
    description: 'upload list of films via any other forms',
  })
  public async addFromFile(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const dataParts = [Buffer.alloc(0)];
    req.on('data', (d) => dataParts.push(d));
    req.on('error', (er) => res.status(500).send(er));
    req.on('end', async () => {
      const fullData = Buffer.concat(dataParts).toString('utf-8');
      const str = fullData
        .split('Content-Type: text/plain')[1]
        .split('---------------------')[0];
      if (str) {
        const result = await this.service
          .addFilmFromFile(str.trim())
          .catch((er) => er);
        res.status(200).send(result);
      }
    });
  }

  @Delete(':id')
  @ApiResponse({ status: 200, type: SuccessDelete })
  public async deleteTransport(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<SuccessDelete> {
    return this.service.deleteFilm(id);
  }
}
