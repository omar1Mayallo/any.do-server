import {plainToInstance} from "class-transformer";
import {validate, ValidationError} from "class-validator";
import {RequestHandler} from "express";
import {BAD_REQUEST} from "http-status";

function extractErrorMessages(errors: ValidationError[]): string[] {
  return errors.map((error) => Object.values(error.constraints!)).flat();
}

function validateObject(obj: object, dto: any) {
  const objectInstance = plainToInstance(dto, obj);
  return validate(objectInstance!);
}

async function validateAndPushErrors(
  obj: object,
  dto: any,
  errs: ValidationError[]
) {
  if (Object.keys(obj).length > 0) {
    const validationErrors = await validateObject(obj, dto);
    errs.push(...validationErrors);
  }
}

//___________REQUEST_BODY_VALIDATION___________//
const validateReqBody =
  (dto: any): RequestHandler =>
  async (req, res, next) => {
    let errs: ValidationError[] = [];
    await validateAndPushErrors(req.body, dto, errs);
    // Extract error messages from err[] reference
    const errors = extractErrorMessages(errs);
    // If errors return it
    if (errors.length > 0) {
      return res.status(BAD_REQUEST).json({status: "validation-error", errors});
    }
    // If no validation errors go to next middleware
    next();
  };

//___________REQUEST_PARAMS_VALIDATION___________//
const validateReqParams =
  (dto: any): RequestHandler =>
  async (req, res, next) => {
    let errs: ValidationError[] = [];
    await validateAndPushErrors(req.params, dto, errs);
    // Extract error messages from err[] reference
    const errors = extractErrorMessages(errs);
    // If errors return it
    if (errors.length > 0) {
      return res.status(BAD_REQUEST).json({status: "validation-error", errors});
    }
    // If no validation errors go to next middleware
    next();
  };

export {validateReqBody, validateReqParams};
