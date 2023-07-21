import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";
import User from "../../../modules/user/user.model";

@ValidatorConstraint({async: true}) // async validation because we access Database
export class IsEmailNotExistConstraint implements ValidatorConstraintInterface {
  async validate(email: string, _args: ValidationArguments) {
    // 1) check if a user with the given email exists
    const user = await User.findOne({where: {email}});

    // 2) If a user with the email exists, return false (validation err) || return true (validation pass).
    return !user;
  }

  defaultMessage(_args: ValidationArguments) {
    return "Email is already exists, Enter a new email address";
  }
}

export function IsEmailNotExist(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailNotExistConstraint,
    });
  };
}
