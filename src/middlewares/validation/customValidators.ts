import {registerDecorator, ValidationOptions} from "class-validator";

export function IsMatchingPasswords(
  property: string,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: any) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];
          return value === relatedValue;
        },

        defaultMessage() {
          return `Passwords do not matches`;
        },
      },
    });
  };
}
