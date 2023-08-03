import {
  IsNotEmpty,
  IsString,
  Length,
  IsHexColor,
  IsOptional,
} from "class-validator";
import {validateReqBody} from "../../middlewares/validation";

class CreateTagDto {
  @Length(5, 50)
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsHexColor()
  color?: string;
}
const createTagValidation = validateReqBody(CreateTagDto);

class UpdateTagDto {
  @Length(5, 50)
  @IsString()
  @IsOptional()
  name?: string;

  @IsHexColor()
  @IsOptional()
  color?: string;
}
const updateTagValidation = validateReqBody(UpdateTagDto);

export {CreateTagDto, createTagValidation, UpdateTagDto, updateTagValidation};
