import Joi from 'joi';
import { genderEnum } from '../../db/models/user.model.js';

export const updateProfileValidation = Joi.object({
    fullname: Joi.string().min(3).max(40),
    gender: Joi.string().valid(...Object.values(genderEnum)),
    phone: Joi.string()
}).unknown(true);
