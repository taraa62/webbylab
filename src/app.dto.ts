import { ApiProperty } from '@nestjs/swagger';

export class SuccessInsert {
  @ApiProperty({ type: String, required: true, example: 'ok' })
  status: 'ok';

  static get() {
    return <SuccessInsert>{ status: 'ok' };
  }
}

export class SuccessDelete {
  @ApiProperty({ type: String, required: true, example: 'ok' })
  status: 'ok';

  static get() {
    return <SuccessDelete>{ status: 'ok' };
  }
}
