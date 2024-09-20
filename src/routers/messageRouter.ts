import Router from '@koa/router';
import {AuthMiddleware, ValidatorMiddleware} from 'middleware';
import {container} from 'tsyringe';
import {ValidationType} from 'middleware/validatorMiddleware';
import joiValidation from 'constants/joiValidation';
import MessageController from 'controllers/messageController';
import Joi from 'joi';

const router = new Router();
const messageControllerInstance = container.resolve(MessageController);

/**
 * @openapi
 * /chats/{chat_id}/messages:
 *   get:
 *     summary: Get messages by chat id
 *     tags:
 *      - Message
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
 *        name: chat_id
 *        schema:
 *          type: integer
 *        required: true
 *     responses:
 *       "200":
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
 *                      message:
 *                        type: string
 *                      date:
 *                        type: string
 *                        example: 2022-03-03T17:11:25.917Z
 *                      chat_id:
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
router.get(
  '/chats/:id/messages',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.link, {
    id: Joi.number().min(1).required(),
  }),
  ValidatorMiddleware(ValidationType.query, joiValidation.paggination),
  messageControllerInstance.getAll,
);

export default router;
