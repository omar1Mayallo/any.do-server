import {
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
  IsEmail,
} from "class-validator";
import {validateReqBody} from "../../middlewares/validation";
import {IsMatchWith} from "../../middlewares/validation/custom/IsMatchWith";
import {IsEmailNotExist} from "../../middlewares/validation/custom/IsEmailNotExist";

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
  UpdateUserPasswordDto,
  updateUserPasswordValidation,
  UpdateUserInfoDto,
  updateUserInfoValidation,
};
