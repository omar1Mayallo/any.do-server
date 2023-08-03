import {IsNotEmpty, IsString, Length} from "class-validator";
import {validateReqBody} from "../../middlewares/validation";

class CreateTaskDto {
  @Length(5, 50)
  @IsString()
  @IsNotEmpty()
  title!: string;
}
const createTaskValidation = validateReqBody(CreateTaskDto);

class UpdateTaskNotesDto {
  @Length(10, 250)
  @IsString()
  @IsNotEmpty()
  notes!: string;
}
const updateTaskNotesValidation = validateReqBody(UpdateTaskNotesDto);

export {
  CreateTaskDto,
  createTaskValidation,
  UpdateTaskNotesDto,
  updateTaskNotesValidation,
};
