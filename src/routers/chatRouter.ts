import Router from '@koa/router';
import {AuthMiddleware, ValidatorMiddleware} from 'middleware';
import {container} from 'tsyringe';
import Joi from 'joi';
import {ValidationType} from 'middleware/validatorMiddleware';
import ChatController from 'controllers/chatController';
import joiValidation from 'constants/joiValidation';

const router = new Router();
const chatControllerInstance = container.resolve(ChatController);

/**
 * @openapi
 * /users/{user_id}/chats:
 *   post:
 *     summary: Create chat to user id
 *     tags:
 *      - Chat
 *     parameters:
 *      - in: path
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: true
 *     requestBody:
 *      description: Body to create chat
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *            required:
 *              - name
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
 *                      owner_id:
 *                        type: integer
 *                      user_id:
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
router.post(
  '/chats',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.body, {
    name: Joi.string().min(2).max(100).required(),
  }),
  ValidatorMiddleware(ValidationType.link, {
    user_id: joiValidation.id,
  }),
  chatControllerInstance.create,
);

/**
 * @openapi
 * /chats:
 *   get:
 *     summary: Get all chats for user
 *     tags:
 *      - Chat
 *     parameters:
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *      - in: query
 *        name: per_page
 *        schema:
 *          type: integer
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
 *                      owner_id:
 *                        type: integer
 *                      user_id:
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
  '/chats',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.query, joiValidation.paggination),
  chatControllerInstance.getAll,
);

/**
 * @openapi
 * /chats/{chat_id}:
 *   delete:
 *     summary: Delete chat by id
 *     tags:
 *      - Chat
 *     parameters:
 *      - in: path
 *        name: chat_id
 *        schema:
 *          type: integer
 *        required: true
 *      - in: query
 *        name: page
 *        schema:
 *          type: integer
 *      - in: query
 *        name: per_page
 *        schema:
 *          type: integer
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
 *                      owner_id:
 *                        type: integer
 *                      user_id:
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
router.delete(
  '/chats/:id',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.link, {
    id: joiValidation.id,
  }),
  chatControllerInstance.delete,
);

export default router;
