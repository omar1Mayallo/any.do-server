import {UserRoles} from "../../constants";
import {validateReqBody} from "../../middlewares/validation";
import {IsNotEmpty, IsEnum} from "class-validator";

class UpdateUserRoleDto {
  @IsEnum(UserRoles)
  @IsNotEmpty()
  role!: keyof typeof UserRoles;
}
const updateUserRoleValidation = validateReqBody(UpdateUserRoleDto);

export {updateUserRoleValidation, UpdateUserRoleDto};
