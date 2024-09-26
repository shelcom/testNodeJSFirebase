import Router from '@koa/router';
import {
  AuthMiddleware,
  UserRoleMiddleware,
  ValidatorMiddleware,
} from 'middleware';
import {container} from 'tsyringe';
import {ValidationType} from 'middleware/validatorMiddleware';
import joiValidation from 'constants/joiValidation';
import PushNotificationController from 'controllers/pushNotificationController';
import Joi from 'joi';
import {DevicePlatform} from 'models/devicePlatform';

const router = new Router();
const pushNotificationControllerInstance = container.resolve(
  PushNotificationController,
);

/**
 * @openapi
 * /push-notification/register:
 *   post:
 *     summary: Register device
 *     tags:
 *      - PushNotification
 *     requestBody:
 *      description: Body to register
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              identifier:
 *                type: string
 *              platform:
 *                type: string
 *                example: apple|android
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
  '/push-notification/register',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.body, {
    identifier: joiValidation.requiredString,
    platform: Joi.string()
      .valid(...Object.values(DevicePlatform).map((item) => item.toString()))
      .required(),
  }),
  pushNotificationControllerInstance.register,
);

export default router;
