import { TransformFnParams } from 'class-transformer';

export const parseInt = (param: TransformFnParams) =>
  Number.parseInt(param.value, 0);

export const trim = (param: TransformFnParams) =>
  (param.value as string).trim();
