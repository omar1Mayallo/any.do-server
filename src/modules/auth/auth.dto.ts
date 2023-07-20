import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {validateReqBody} from "../../middlewares/validation";
import {IsMatchingPasswords} from "../../middlewares/validation/customValidators";

// LOGIN
class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Length(8, 25)
  @IsNotEmpty()
  password!: string;
}
const loginValidation = validateReqBody(LoginDto);

// REGISTER
class RegisterDto {
  @Length(3, 30)
  @IsString()
  @IsNotEmpty()
  username!: string;

  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @Length(8, 25)
  @IsNotEmpty()
  password!: string;

  @IsNotEmpty()
  @IsMatchingPasswords("password")
  confirmPassword!: string;
}
const registerValidation = validateReqBody(RegisterDto);

export {LoginDto, RegisterDto, loginValidation, registerValidation};
