import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ async: false })
export class YearValidate implements ValidatorConstraintInterface {
  public validate(
    value: any,
    validationArguments?: ValidationArguments,
  ): boolean {
    value = Number.parseInt(value, 0);
    return value > 1900 && value < new Date().getFullYear();
  }
}

export function IsYear(validationOptions?: ValidationOptions) {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [],
      validator: YearValidate,
    });
  };
}
