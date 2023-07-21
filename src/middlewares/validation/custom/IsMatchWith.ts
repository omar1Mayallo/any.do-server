import {registerDecorator, ValidationOptions} from "class-validator";

export function IsMatchWith(
  property: string, // property that being decorated
  validationOptions?: ValidationOptions // {message, each, ...etc}
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isMatchingWith",
      target: object.constructor,
      propertyName: propertyName, // The propertyName is the name of the property being validated
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: any, args: any) {
          const [relatedPropertyName] = args.constraints;
          const relatedValue = args.object[relatedPropertyName];
          return value === relatedValue;
        },

        defaultMessage() {
          return `${property} do not matches with other field`;
        },
      },
    });
  };
}
