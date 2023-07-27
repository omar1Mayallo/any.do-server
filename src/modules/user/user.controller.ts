import CRUDController from "../../utils/CRUDController";
import User from "./user.model";

// CRUD_CONTROLLER
const CRUDUsers = new CRUDController(User);

// ---------------------------------
// @desc    GET All Users
// @route   GET  /users
// @access  Private("ADMIN")
// ---------------------------------
const getAllUsers = CRUDUsers.getAll;

export {getAllUsers};
