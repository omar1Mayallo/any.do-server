import {IsNotEmpty, IsString, Length} from "class-validator";
import {validateReqBody} from "../../middlewares/validation";
import {IsMatchWith} from "../../middlewares/validation/custom/IsMatchWith";

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

export {UpdateUserPasswordDto, updateUserPasswordValidation};
