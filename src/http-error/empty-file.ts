import { HttpException, HttpStatus } from '@nestjs/common';

export class EmptyFile extends HttpException {
  constructor() {
    super('File is empty.', HttpStatus.I_AM_A_TEAPOT);
  }
}
