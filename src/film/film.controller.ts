import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AdminGuard } from '../auth/admin.guard';
import { AddFileDto, AddFilmFromFileResDto, FilmReqDto } from './film.dto';
import { SuccessDelete, SuccessInsert } from '../app.dto';
import { FilmService } from './film.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';

@ApiTags('Film - admin panel')
@Controller('film')
@ApiBearerAuth('Authorization')
@UseGuards(AdminGuard)
export class FilmController {
  constructor(private service: FilmService) {}

  @Put('/')
  @ApiResponse({ status: 201, type: SuccessInsert, description: 'add film' })
  public addFilm(@Body() dto: FilmReqDto): Promise<SuccessInsert> {
    return this.service.addFilm(dto);
  }

  @Post('/upload-list-swagger/')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    description: 'upload list of films via swagger',
    type: AddFileDto,
    required: false,
  })
  @UseInterceptors(FileFieldsInterceptor([{ name: 'file', maxCount: 1 }]))
  public async addFromFileSwagger(
    @UploadedFiles() files,
    @Body() dto: AddFileDto,
  ): Promise<SuccessInsert | AddFilmFromFileResDto> {
    const file: Express.Multer.File = (files?.file || [])[0];
    if (!file) throw new BadRequestException();
    // TODO I don't handle big files.
    const str = file.buffer.toString('utf-8').trim();
    return this.service.addFileFromFile(str);
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
          .addFileFromFile(str.trim())
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
