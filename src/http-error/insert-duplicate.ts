import { HttpException, HttpStatus } from '@nestjs/common';

export class InsertDuplicate extends HttpException {
  constructor() {
    super(
      'Forbidden add duplicate film by name and year.',
      HttpStatus.FORBIDDEN,
    );
  }
}
