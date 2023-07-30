import {IsNotEmpty, IsString, Length} from "class-validator";
import {validateReqBody} from "../../middlewares/validation";

// LOGIN
class CreateTaskDto {
  @Length(5, 50)
  @IsString()
  @IsNotEmpty()
  title!: string;
}
const createTaskValidation = validateReqBody(CreateTaskDto);

export {CreateTaskDto, createTaskValidation};
