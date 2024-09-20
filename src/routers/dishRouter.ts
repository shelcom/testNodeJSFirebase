import Router from '@koa/router';
import {
  AuthMiddleware,
  UserRoleMiddleware,
  UploadImageMiddleware,
  ValidatorMiddleware,
  ImageValidatorMiddleware,
} from 'middleware';
import {container} from 'tsyringe';
import Joi from 'joi';
import {ValidationType} from 'middleware/validatorMiddleware';
import DishController from 'controllers/dishController';
import {DishType} from 'models/dishType';
import {UserRole} from 'models/database/user';
import joiValidation from 'constants/joiValidation';
import {ImageType} from 'models/imageType';

const router = new Router();
const dishControllerInstance = container.resolve(DishController);

/**
 * @openapi
 * /restaurants/{restaurant_id}/dishes:
 *   post:
 *     summary: Create dish
 *     tags:
 *      - Dish
 *      - Service Provider role
 *     parameters:
 *      - in: path
 *        name: restaurant_id
 *        schema:
 *          type: integer
 *        required: true
 *     requestBody:
 *      description: Body to create dish
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              images:
 *                type: array
 *                items:
 *                  type: string
 *              price:
 *                type: integer
 *              type:
 *                type: string
 *                example: new|regular
 *            required:
 *              - name
 *              - description
 *              - images
 *              - price
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                      name:
 *                        type: string
 *                      description:
 *                        type: string
 *                      images:
 *                        type: array
 *                        items:
 *                          type: string
 *                      restaurant_id:
 *                        type: integer
 *                      price:
 *                        type: integer
 *                      type:
 *                        type: string
 *                        example: new|regular
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       422:
 *        description: Unprocessable entity error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 */
router.post(
  '/restaurants/:restaurantId/dishes',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.serviceProvider),
  ValidatorMiddleware(ValidationType.body, {
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).required(),
    images: joiValidation.optionalImages.required(),
    price: Joi.number().min(0).required(),
    type: Joi.string()
      .valid(...Object.values(DishType).map((item) => item.toString()))
      .default(DishType.regular),
  }),
  ValidatorMiddleware(ValidationType.link, {
    restaurantId: Joi.number().min(1).required(),
  }),
  ImageValidatorMiddleware(ImageType.dish),
  dishControllerInstance.create,
);

/**
 * @openapi
 * /dishes/{dish_id}:
 *   patch:
 *     summary: Update dish
 *     tags:
 *      - Dish
 *      - Service Provider role
 *     parameters:
 *      - in: path
 *        name: dish_id
 *        schema:
 *          type: integer
 *        required: true
 *     requestBody:
 *      description: Body to update dish
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              description:
 *                type: string
 *              images:
 *                type: array
 *                items:
 *                  type: string
 *              price:
 *                type: integer
 *              type:
 *                type: string
 *                example: new|regular
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                      name:
 *                        type: string
 *                      description:
 *                        type: string
 *                      images:
 *                        type: array
 *                        items:
 *                          type: string
 *                      restaurant_id:
 *                        type: integer
 *                      price:
 *                        type: integer
 *                      type:
 *                        type: string
 *                        example: new|regular
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       422:
 *        description: Unprocessable entity error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 */
router.patch(
  '/dishes/:id',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.serviceProvider),
  ValidatorMiddleware(ValidationType.body, {
    name: Joi.string().min(2).max(100),
    description: Joi.string().min(10),
    images: joiValidation.optionalImages,
    price: Joi.number().min(0),
    type: Joi.string().valid(
      ...Object.values(DishType).map((item) => item.toString()),
    ),
  }),
  ValidatorMiddleware(ValidationType.link, {
    id: Joi.number().min(1).required(),
  }),
  ImageValidatorMiddleware(ImageType.dish),
  dishControllerInstance.update,
);

/**
 * @openapi
 * /dishes/{dish_id}:
 *   get:
 *     summary: Get dishes by restaurant id
 *     tags:
 *      - Dish
 *     parameters:
 *      - in: path
 *        name: dish_id
 *        schema:
 *          type: integer
 *        required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                      name:
 *                        type: string
 *                      description:
 *                        type: string
 *                      images:
 *                        type: array
 *                        items:
 *                          type: string
 *                      restaurant_id:
 *                        type: integer
 *                      price:
 *                        type: integer
 *                      type:
 *                        type: string
 *                        example: new|regular
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       422:
 *        description: Unprocessable entity error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 */
router.get(
  '/dishes/:id',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.link, {
    id: Joi.number().min(1).required(),
  }),
  dishControllerInstance.getOne,
);

/**
 * @openapi
 * /restaurants/{restaurant_id}/dishes:
 *   get:
 *     summary: Get dishes by restaurant id
 *     tags:
 *      - Dish
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *      - in: query
 *        name: per_page
 *        schema:
 *          type: integer
 *      - in: path
 *        name: restaurant_id
 *        schema:
 *          type: integer
 *        required: true
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: integer
 *                      name:
 *                        type: string
 *                      description:
 *                        type: string
 *                      images:
 *                        type: array
 *                        items:
 *                          type: string
 *                      restaurant_id:
 *                        type: integer
 *                      price:
 *                        type: integer
 *                      type:
 *                        type: string
 *                        example: new|regular
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       404:
 *        description: Not found
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       422:
 *        description: Unprocessable entity error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 */
router.get(
  '/restaurants/:restaurantId/dishes',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.link, {
    restaurantId: Joi.number().min(1).required(),
  }),
  ValidatorMiddleware(ValidationType.query, joiValidation.paggination),
  dishControllerInstance.getAll,
);

/**
 * @openapi
 * /dishes/upload_image:
 *   post:
 *     summary: Upload image
 *     tags:
 *      - Dish
 *      - Service Provider role
 *     requestBody:
 *      content:
 *        multipart/form-data:
 *          schema:
 *            type: object
 *            properties:
 *              image:
 *                type: string
 *                format: binary
 *     responses:
 *       201:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    url:
 *                      type: string
 *       401:
 *        description: Unauthorized
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       403:
 *        description: Forbidden
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 *       422:
 *        description: Unprocessable entity error
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    message:
 *                      type: string
 *                    errors:
 *                      type: array
 *                      items:
 *                        type: object
 */
router.post(
  '/dishes/upload_image',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.serviceProvider),
  UploadImageMiddleware,
  dishControllerInstance.uploadImage,
);

export default router;
