import Router from '@koa/router';
import {
  AuthMiddleware,
  UserRoleMiddleware,
  ValidatorMiddleware,
} from 'middleware';
import {container} from 'tsyringe';
import Joi from 'joi';
import {ValidationType} from 'middleware/validatorMiddleware';
import OrderController from 'controllers/orderController';
import {UserRole} from 'models/database/user';
import {OrderStatus} from 'models/orderStatus';
import joiValidation from 'constants/joiValidation';

const router = new Router();
const orderControllerInstance = container.resolve(OrderController);

/**
 * @openapi
 * /orders:
 *   get:
 *     summary: Get all orders for SERVICE PROVIDER and DELIVERY, get my orders for USER
 *     tags:
 *      - Order
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
 *                      comment:
 *                        type: string
 *                      address:
 *                        type: string
 *                      delivery_time:
 *                        type: string
 *                        example: 2022-03-03T17:11:25.917Z
 *                      restaurant_id:
 *                        type: integer
 *                      status:
 *                        type: string
 *                        example: waiting_for_payment|new|took_order|delivering|done
 *                      user_id:
 *                        type: integer
 *                      dishes:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: integer
 *                            name:
 *                              type: string
 *                            description:
 *                              type: string
 *                            price:
 *                              type: integer
 *                            images:
 *                              type: array
 *                              items:
 *                                type: string
 *                            restaurant_id:
 *                              type: integer
 *                            type:
 *                              type: string
 *                              example: new|regular
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
  '/orders',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.query, joiValidation.paggination),
  orderControllerInstance.getAll,
);

/**
 * @openapi
 * /restaurants/{restaurant_id}/orders:
 *   get:
 *     summary: Get all orders for SERVICE PROVIDER and DELIVERY by restaurant, get my orders for USER by restaurant
 *     tags:
 *      - Order
 *     parameters:
 *      - in: path
 *        name: restaurant_id
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
 *                      comment:
 *                        type: string
 *                      address:
 *                        type: string
 *                      delivery_time:
 *                        type: string
 *                        example: 2022-03-03T17:11:25.917Z
 *                      restaurant_id:
 *                        type: integer
 *                      status:
 *                        type: string
 *                        example: waiting_for_payment|new|took_order|delivering|done
 *                      user_id:
 *                        type: integer
 *                      dishes:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: integer
 *                            name:
 *                              type: string
 *                            description:
 *                              type: string
 *                            price:
 *                              type: integer
 *                            images:
 *                              type: array
 *                              items:
 *                                type: string
 *                            restaurant_id:
 *                              type: integer
 *                            type:
 *                              type: string
 *                              example: new|regular
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
  '/restaurants/:id/orders',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.link, {
    id: Joi.number().min(1).required(),
  }),
  ValidatorMiddleware(ValidationType.query, joiValidation.paggination),
  orderControllerInstance.getAllForRestaurant,
);

/**
 * @openapi
 * /orders/{order_id}:
 *   patch:
 *     summary: Change order status by id
 *     tags:
 *      - Order
 *      - Delivery role
 *     parameters:
 *      - in: path
 *        name: order_id
 *        schema:
 *          type: integer
 *        required: true
 *     requestBody:
 *      description: Body to change status of the order
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              status:
 *                type: string
 *                example: waiting_for_payment|new|took_order|delivering|done
 *            required:
 *              - status
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
 *                      comment:
 *                        type: string
 *                      address:
 *                        type: string
 *                      delivery_time:
 *                        type: string
 *                        example: 2022-03-03T17:11:25.917Z
 *                      restaurant_id:
 *                        type: integer
 *                      status:
 *                        type: string
 *                        example: waiting_for_payment|new|took_order|delivering|done
 *                      user_id:
 *                        type: integer
 *                      dishes:
 *                        type: array
 *                        items:
 *                          type: object
 *                          properties:
 *                            id:
 *                              type: integer
 *                            name:
 *                              type: string
 *                            description:
 *                              type: string
 *                            price:
 *                              type: integer
 *                            images:
 *                              type: array
 *                              items:
 *                                type: string
 *                            restaurant_id:
 *                              type: integer
 *                            type:
 *                              type: string
 *                              example: new|regular
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
  '/orders/:id',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.delivery),
  ValidatorMiddleware(ValidationType.body, {
    status: Joi.string()
      .valid(...Object.values(OrderStatus).map((item) => item.toString()))
      .required(),
  }),
  ValidatorMiddleware(ValidationType.link, {
    id: Joi.number().required(),
  }),
  orderControllerInstance.changeStatus,
);

/**
 * @openapi
 * /restaurants/{restaurant_id}/orders:
 *   post:
 *     summary: Add order to restaurant
 *     tags:
 *      - Order
 *      - User role
 *     parameters:
 *      - in: path
 *        name: restaurant_id
 *        schema:
 *          type: integer
 *        required: true
 *     requestBody:
 *      description: Body to add restaurant
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *              comment:
 *                type: string
 *              dish_ids:
 *                type: array
 *                items:
 *                  type: integer
 *              address:
 *                type: string
 *              delivery_time:
 *                type: string
 *                example: 2022-03-03T17:11:25.917Z
 *            required:
 *              - name
 *              - dish_ids
 *              - address
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
 *                    payment:
 *                      type: object
 *                      properties:
 *                        paymentIntentId:
 *                          type: string
 *                        paymentIntentSecret:
 *                          type: string
 *                        customerId:
 *                          type: string
 *                        ephemeralKeySecret:
 *                          type: string
 *                        id:
 *                          type: integer
 *                    order:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        name:
 *                          type: string
 *                        comment:
 *                          type: string
 *                        address:
 *                          type: string
 *                        delivery_time:
 *                          type: string
 *                          example: 2022-03-03T17:11:25.917Z
 *                        restaurant_id:
 *                          type: integer
 *                        status:
 *                          type: string
 *                          example: waiting_for_payment|new|took_order|delivering|done
 *                        user_id:
 *                          type: integer
 *                        dishes:
 *                          type: array
 *                          items:
 *                            type: object
 *                            properties:
 *                              id:
 *                                type: integer
 *                              name:
 *                                type: string
 *                              description:
 *                                type: string
 *                              price:
 *                                type: integer
 *                              images:
 *                                type: array
 *                                items:
 *                                  type: string
 *                              restaurant_id:
 *                                type: integer
 *                              type:
 *                                type: string
 *                                example: new|regular
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
  '/restaurants/:id/orders',
  AuthMiddleware,
  UserRoleMiddleware(UserRole.user),
  ValidatorMiddleware(ValidationType.body, {
    name: Joi.string().min(2).max(100).required(),
    comment: Joi.string(),
    dish_ids: Joi.array().items(Joi.number()).min(1).required(),
    address: Joi.string().min(3).required(),
    delivery_time: joiValidation.optionalDate,
  }),
  ValidatorMiddleware(ValidationType.link, {
    id: Joi.number().min(1).required(),
  }),
  orderControllerInstance.create,
);

/**
 * @openapi
 * /orders/{order_id}:
 *   delete:
 *     summary: Delete order by id
 *     tags:
 *      - Order
 *     parameters:
 *      - in: path
 *        name: order_id
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
router.delete(
  '/orders/:id',
  AuthMiddleware,
  ValidatorMiddleware(ValidationType.link, {
    id: Joi.number().min(1).required(),
  }),
  orderControllerInstance.delete,
);

export default router;
