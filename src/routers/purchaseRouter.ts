import Router from '@koa/router';
import {
  AuthMiddleware,
  UserRoleMiddleware,
  ValidatorMiddleware,
} from 'middleware';
import {container} from 'tsyringe';
import {ValidationType} from 'middleware/validatorMiddleware';
import joiValidation from 'constants/joiValidation';
import {UserRole} from 'models/database/user';
import PurchaseController from 'controllers/purchaseController';
import Joi from 'joi';
import {DevicePlatform} from 'models/devicePlatform';

const router = new Router();
const purchaseControllerInstance = container.resolve(PurchaseController);

/**
 * @openapi
 * /purchases/verify:
 *   post:
 *     summary: Verify purchase
 *     tags:
 *      - Purchase
 *      - User role
 *     requestBody:
 *      description: Body to verify
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              receipt:
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
  '/purchases/verify',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.user),
  ValidatorMiddleware(ValidationType.body, {
    receipt: joiValidation.requiredString,
    platform: Joi.string()
      .valid(...Object.values(DevicePlatform).map((item) => item.toString()))
      .required(),
  }),
  purchaseControllerInstance.verify,
);

export default router;
