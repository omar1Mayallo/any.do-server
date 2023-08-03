import CRUDController from "../../utils/CRUDController";
import {CreateTagDto, UpdateTagDto} from "./tag.dto";
import Tag from "./tag.model";

const CRUDTags = new CRUDController<UpdateTagDto, CreateTagDto>(Tag);

// ---------------------------------
// @desc    GET Tags
// @route   GET  /tags
// @access  Protected
// ---------------------------------
const getTags = CRUDTags.getAll;

// ---------------------------------
// @desc    GET Tag
// @route   GET  /tags/:id
// @access  Private("ADMIN")
// ---------------------------------
const getTag = CRUDTags.getOne;

// ---------------------------------
// @desc    UPDATE Tag
// @route   PUT  /tags/:id
// @access  Private("ADMIN")
// ---------------------------------
const updateTag = CRUDTags.updateOne;

// ---------------------------------
// @desc    DELETE(force) Tag
// @route   DELETE  /tags/:id
// @access  Private("ADMIN")
// ---------------------------------
const deleteTag = CRUDTags.deleteOne;

// ---------------------------------
// @desc    CREATE Tag
// @route   POST  /tags
// @access  Private("ADMIN")
// ---------------------------------
const createTag = CRUDTags.createOne;

export {getTags, deleteTag, getTag, updateTag, createTag};
