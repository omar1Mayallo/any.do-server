import {validateReqBody} from "../../middlewares/validation";
import {IsMatchWith} from "../../middlewares/validation/custom/IsMatchWith";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsEmail,
} from "class-validator";
import {IsEmailNotExist} from "../../middlewares/validation/custom/IsEmailNotExist";

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
  @IsEmailNotExist()
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

// UPDATE Password
class UpdateUserPasswordDto {
  @IsString()
  @IsNotEmpty()
  currentPassword!: string;

  @Length(8, 25)
  @IsNotEmpty()
  newPassword!: string;

  @IsMatchWith("newPassword", {
    message: "Confirm new password must match with the new password",
  })
  confirmNewPassword!: string;
}
const updateUserPasswordValidation = validateReqBody(UpdateUserPasswordDto);

// Update Email&Username
class UpdateUserInfoDto {
  @IsString()
  @IsOptional()
  username?: string;

  @IsEmail()
  @IsEmailNotExist()
  @IsOptional()
  email?: string;
}
const updateUserInfoValidation = validateReqBody(UpdateUserInfoDto);

export {
  LoginDto,
  RegisterDto,
  loginValidation,
  registerValidation,
  UpdateUserPasswordDto,
  updateUserPasswordValidation,
  UpdateUserInfoDto,
  updateUserInfoValidation,
};
