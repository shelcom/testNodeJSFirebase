import Router from '@koa/router';
import {
  AuthMiddleware,
  UserRoleMiddleware,
  ValidatorMiddleware,
} from 'middleware';
import {container} from 'tsyringe';
import {ValidationType} from 'middleware/validatorMiddleware';
import joiValidation from 'constants/joiValidation';
import PaymentController from 'controllers/paymentController';
import {UserRole} from 'models/database/user';

const router = new Router();
const paymentControllerInstance = container.resolve(PaymentController);

/**
 * @openapi
 * /payments/{payment_id}/confirm:
 *   patch:
 *     summary: Confirm payment
 *     tags:
 *      - Payment
 *      - User role
 *     parameters:
 *      - in: path
 *        name: payment_id
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
  '/payments/:id/confirm',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.user),
  ValidatorMiddleware(ValidationType.link, {
    id: joiValidation.id,
  }),
  paymentControllerInstance.confirmPayment,
);

/**
 * @openapi
 * /payments/{payment_id}/payment_details:
 *   get:
 *     summary: Get payment details
 *     tags:
 *      - Payment
 *      - User role
 *     parameters:
 *      - in: path
 *        name: payment_id
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
 *                  type: object
 *                  properties:
 *                    paymentIntentId:
 *                      type: string
 *                    paymentIntentSecret:
 *                      type: string
 *                    customerId:
 *                      type: string
 *                    ephemeralKeySecret:
 *                      type: string
 *                    id:
 *                      type: integer
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
  '/orders/:id/payment_details',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.user),
  ValidatorMiddleware(ValidationType.link, {
    id: joiValidation.id,
  }),
  paymentControllerInstance.getPayment,
);

export default router;
