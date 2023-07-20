import {IsEmail, IsNotEmpty, IsString, Length} from "class-validator";
import {validateReqBody} from "../../middlewares/validation";
import {IsMatchWith} from "../../middlewares/validation/custom/IsMatchWith";

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
  @IsMatchWith("password", {message: "Passwords don't match"})
  confirmPassword!: string;
}
const registerValidation = validateReqBody(RegisterDto);

export {LoginDto, RegisterDto, loginValidation, registerValidation};
