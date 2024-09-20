import ImageController from 'controllers/imageController';
import Router from '@koa/router';
import {ValidatorMiddleware} from 'middleware';
import {container} from 'tsyringe';
import Joi from 'joi';
import {ValidationType} from 'middleware/validatorMiddleware';

const router = new Router();
const imageControllerInstance = container.resolve(ImageController);

router.get(
  '/:name',
  ValidatorMiddleware(ValidationType.link, {name: Joi.string().required()}),
  imageControllerInstance.getImage,
);

export default router;
