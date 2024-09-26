import Joi from 'joi';
import { UserRole } from 'models/database/user';

export default {
  email: Joi.string().email().lowercase().required(),
  password: Joi.string().min(6).max(32).required(),
  optionalImages: Joi.array().items(Joi.string().uri()).min(1),
  roles: Joi.string()
    .valid(...Object.values(UserRole).map((item) => item.toString()))
    .required(),
  paggination: {
    page: Joi.number().min(1).default(1),
    per_page: Joi.number().min(1).default(10),
  },
  optionalLocation: Joi.object({
    latitude: Joi.string().required(),
    longitude: Joi.string().required(),
  }),
  optionalDate: Joi.date().iso(),
  id: Joi.number().min(1).required(),
  requiredString: Joi.string().min(1).required(),
};
