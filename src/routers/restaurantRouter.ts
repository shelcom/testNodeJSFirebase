import Router from '@koa/router';
import {
  AuthMiddleware,
  ValidatorMiddleware,
  UserRoleMiddleware,
  UploadImageMiddleware,
  ImageValidatorMiddleware,
} from 'middleware';
import {container} from 'tsyringe';
import Joi from 'joi';
import RestaurantController from 'controllers/restaurantController';
import {ValidationType} from 'middleware/validatorMiddleware';
import {UserRole} from 'models/database/user';
import joiValidation from 'constants/joiValidation';
import {ImageType} from 'models/imageType';

const router = new Router();
const restaurantControllerInstance = container.resolve(RestaurantController);

/**
 * @openapi
 * /restaurants:
 *   post:
 *     summary: Create restaurant
 *     tags:
 *      - Restaurant
 *      - Service Provider role
 *     requestBody:
 *      description: Body to create
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
 *              location:
 *                type: object
 *                properties:
 *                  latitude:
 *                    type: string
 *                  longitude:
 *                    type: string
 *            required:
 *              - name
 *              - description
 *              - images
 *              - location
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
 *                    id:
 *                      type: integer
 *                    name:
 *                      type: string
 *                    description:
 *                      type: string
 *                    images:
 *                      type: array
 *                      items:
 *                        type: string
 *                    owner_id:
 *                      type: integer
 *                    location:
 *                      type: object
 *                      properties:
 *                        latitude:
 *                          type: string
 *                        longiture:
 *                          type: string
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
  '/',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.serviceProvider),
  ValidatorMiddleware(ValidationType.body, {
    name: Joi.string().min(2).max(100).required(),
    description: Joi.string().min(10).required(),
    images: joiValidation.optionalImages.required(),
    location: joiValidation.optionalLocation.required(),
  }),
  ImageValidatorMiddleware(ImageType.restaurant),
  restaurantControllerInstance.create,
);

/**
 * @openapi
 * /restaurants/{restaurant_id}:
 *   patch:
 *     summary: Update restaurant
 *     parameters:
 *      - in: path
 *        name: restaurant_id
 *        schema:
 *          type: integer
 *        required: true
 *     tags:
 *      - Restaurant
 *      - Service Provider role
 *     requestBody:
 *      description: Body to update
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
 *              location:
 *                type: object
 *                properties:
 *                  latitude:
 *                    type: string
 *                  longiture:
 *                    type: string
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
 *                    id:
 *                      type: integer
 *                    name:
 *                      type: string
 *                    description:
 *                      type: string
 *                    images:
 *                      type: array
 *                      items:
 *                        type: string
 *                    owner_id:
 *                      type: integer
 *                    location:
 *                      type: object
 *                      properties:
 *                        latitude:
 *                          type: string
 *                        longiture:
 *                          type: string
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
router.patch(
  '/:id',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.serviceProvider),
  ValidatorMiddleware(ValidationType.link, {
    id: Joi.number().min(1).required(),
  }),
  ValidatorMiddleware(ValidationType.body, {
    name: Joi.string().min(2).max(100),
    description: Joi.string().min(10),
    images: joiValidation.optionalImages,
    location: joiValidation.optionalLocation,
  }),
  ImageValidatorMiddleware(ImageType.restaurant),
  restaurantControllerInstance.update,
);

/**
 * @openapi
 * /restaurants:
 *   get:
 *     summary: Get all restaurants
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *      - in: query
 *        name: per_page
 *        schema:
 *          type: integer
 *     tags:
 *      - Restaurant
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
 *                      owner_id:
 *                        type: integer
 *                      location:
 *                        type: object
 *                        properties:
 *                          latitude:
 *                            type: string
 *                          longiture:
 *                            type: string
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
  '/',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.query, joiValidation.paggination),
  restaurantControllerInstance.getAll,
);

/**
 * @openapi
 * /restaurants/{restaurant_id}:
 *   get:
 *     summary: Get restaurant by id
 *     parameters:
 *      - in: path
 *        name: restaurant_id
 *        schema:
 *          type: integer
 *        required: true
 *     tags:
 *      - Restaurant
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                data:
 *                  type: object
 *                  properties:
 *                    id:
 *                      type: integer
 *                    name:
 *                      type: string
 *                    description:
 *                      type: string
 *                    images:
 *                      type: array
 *                      items:
 *                        type: string
 *                    owner_id:
 *                      type: integer
 *                    location:
 *                      type: object
 *                      properties:
 *                        latitude:
 *                          type: string
 *                        longiture:
 *                          type: string
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
  '/:id',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.link, {
    id: Joi.number().min(1).required(),
  }),
  restaurantControllerInstance.getOne,
);

/**
 * @openapi
 * /restaurants/{restaurant_id}:
 *   delete:
 *     summary: Delete restaurant by id
 *     parameters:
 *      - in: path
 *        name: restaurant_id
 *        schema:
 *          type: integer
 *        required: true
 *     tags:
 *      - Restaurant
 *      - Service Provider role
 *     responses:
 *       200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
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
router.delete(
  '/:id',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.serviceProvider),
  ValidatorMiddleware(ValidationType.link, {
    id: Joi.number().min(1).required(),
  }),
  restaurantControllerInstance.delete,
);

/**
 * @openapi
 * /restaurants/upload_image:
 *   post:
 *     summary: Upload image
 *     tags:
 *      - Restaurant
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
  '/upload_image',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.serviceProvider),
  UploadImageMiddleware,
  restaurantControllerInstance.uploadImage,
);

export default router;
