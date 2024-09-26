import Router from '@koa/router';
import {
  AuthMiddleware,
  UserRoleMiddleware,
  ValidatorMiddleware,
} from 'middleware';
import {container} from 'tsyringe';
import Joi from 'joi';
import {ValidationType} from 'middleware/validatorMiddleware';
import joiValidation from 'constants/joiValidation';
import CommentController from 'controllers/commentController';
import {UserRole} from 'models/database/user';

const router = new Router();
const commentControllerInstance = container.resolve(CommentController);

/**
 * @openapi
 * /restaurants/{restaurant_id}/comments:
 *   post:
 *     summary: Create comment
 *     tags:
 *      - Comment
 *      - User role
 *     parameters:
 *      - in: path
 *        name: restaurant_id
 *        schema:
 *          type: integer
 *        required: true
 *     requestBody:
 *      description: Body to create comment
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              comment:
 *                type: string
 *              rating:
 *                type: integer
 *            required:
 *              - Comment
 *              - rating
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
 *                      comment:
 *                        type: string
 *                      rating:
 *                        type: integer
 *                      restaurant_id:
 *                        type: integer
 *                      owner_id:
 *                        type: integer
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
  '/restaurants/:id/comments',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.user),
  ValidatorMiddleware(ValidationType.body, {
    comment: Joi.string().min(2).required(),
    rating: Joi.number().min(0).max(5).required(),
  }),
  ValidatorMiddleware(ValidationType.link, {
    id: joiValidation.id,
  }),
  commentControllerInstance.create,
);

/**
 * @openapi
 * /comments/{comment_id}:
 *   patch:
 *     summary: Update comment
 *     tags:
 *      - Comment
 *      - User role
 *     parameters:
 *      - in: path
 *        name: comment_id
 *        schema:
 *          type: integer
 *        required: true
 *     requestBody:
 *      description: Body to update comment
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              comment:
 *                type: string
 *              rating:
 *                type: integer
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
 *                      comment:
 *                        type: string
 *                      rating:
 *                        type: integer
 *                      restaurant_id:
 *                        type: integer
 *                      owner_id:
 *                        type: integer
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
  '/comments/:id',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.user),
  ValidatorMiddleware(ValidationType.body, {
    comment: Joi.string().min(2),
    rating: Joi.number().min(0).max(5),
  }),
  ValidatorMiddleware(ValidationType.link, {
    id: joiValidation.id,
  }),
  commentControllerInstance.update,
);

/**
 * @openapi
 * /restaurants/{restaurant_id}/comments:
 *   get:
 *     summary: Get all comment by restaurant id
 *     tags:
 *      - Comment
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
 *                      comment:
 *                        type: string
 *                      rating:
 *                        type: integer
 *                      restaurant_id:
 *                        type: integer
 *                      owner_id:
 *                        type: integer
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
  '/restaurants/:id/comments',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.link, {
    id: joiValidation.id,
  }),
  ValidatorMiddleware(ValidationType.query, joiValidation.paggination),
  commentControllerInstance.getAll,
);

export default router;
