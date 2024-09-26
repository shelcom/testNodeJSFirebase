import UserController from 'controllers/userController';
import Router from '@koa/router';
import {AuthMiddleware, ValidatorMiddleware} from 'middleware';
import {UserRole} from 'models/database/user';
import {container} from 'tsyringe';
import Joi from 'joi';
import {ValidationType} from 'middleware/validatorMiddleware';
import joiValidation from 'constants/joiValidation';

const router = new Router();
const userControllerInstance = container.resolve(UserController);

/**
 * @openapi
 * /registration:
 *   post:
 *     summary: Registration
 *     tags:
 *      - Auth
 *     requestBody:
 *      description: Body to sign up
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *              role:
 *                type: string
 *                example: USER|DELIVERY|SERVICE_PROVIDER
 *            required:
 *              - email
 *              - password
 *              - role
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
 *                    tokens:
 *                      type: object
 *                      properties:
 *                        accessToken:
 *                          type: string
 *                        refreshToken:
 *                          type: string
 *                    user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        role:
 *                          type: string
 *                          example: USER|DELIVERY|SERVICE_PROVIDER
 *                        email:
 *                          type: string
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
  '/registration',
  ValidatorMiddleware(ValidationType.body, {
    email: joiValidation.email,
    password: joiValidation.password,
    role: joiValidation.roles,
  }),
  userControllerInstance.registration,
);

/**
 * @openapi
 * /registration_passkeys_initialize:
 *   post:
 *     summary: Passkeys registration
 *     tags:
 *      - Auth
 *      - Passkeys
 *     requestBody:
 *      description: Body to sign up
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              role:
 *                type: string
 *                example: USER|DELIVERY|SERVICE_PROVIDER
 *            required:
 *              - email
 *              - role
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
 *                    challenge:
 *                      type: string
 *                    user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        role:
 *                          type: string
 *                          example: USER|DELIVERY|SERVICE_PROVIDER
 *                        email:
 *                          type: string
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
  '/registration_passkeys_initialize',
  ValidatorMiddleware(ValidationType.body, {
    email: joiValidation.email,
    role: joiValidation.roles,
  }),
  userControllerInstance.registrationPasskeysInitialize,
);

/**
 * @openapi
 * /users/{user_id}/registration_passkeys_finalize:
 *   post:
 *     summary: Passkeys registration
 *     tags:
 *      - Auth
 *      - Passkeys
 *     parameters:
 *      - in: path
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: true
 *     requestBody:
 *      description: Body to sign up
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              response:
 *                type: object
 *                properties:
 *                  attestationObject:
 *                    type: string
 *                  clientDataJSON:
 *                    type: string
 *              id:
 *                type: string
 *              rawId:
 *                type: string
 *              type:
 *                type: string
 *            required:
 *              - id
 *              - rawId
 *              - type
 *              - response
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
 *                    tokens:
 *                      type: object
 *                      properties:
 *                        accessToken:
 *                          type: string
 *                        refreshToken:
 *                          type: string
 *                    user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        role:
 *                          type: string
 *                          example: USER|DELIVERY|SERVICE_PROVIDER
 *                        email:
 *                          type: string
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
 */
router.post(
  '/users/:id/registration_passkeys_finalize',
  ValidatorMiddleware(ValidationType.link, {
    id: joiValidation.id,
  }),
  ValidatorMiddleware(ValidationType.body, {
    id: joiValidation.requiredString,
    rawId: joiValidation.requiredString,
    type: joiValidation.requiredString,
    response: {
      attestationObject: joiValidation.requiredString,
      clientDataJSON: joiValidation.requiredString,
    },
  }),
  userControllerInstance.registrationPasskeysFinalize,
);

/**
 * @openapi
 * /login_passkeys_initialize:
 *   post:
 *     summary: Passkeys login
 *     tags:
 *      - Auth
 *      - Passkeys
 *     requestBody:
 *      description: Body to login
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *            required:
 *              - email
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
 *                    challenge:
 *                      type: string
 *                    credentialID:
 *                      type: string
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
 */
router.post(
  '/login_passkeys_initialize',
  ValidatorMiddleware(ValidationType.body, {
    email: joiValidation.email,
  }),
  userControllerInstance.loginPasskeysInitialize,
);

/**
 * @openapi
 * /login_passkeys_finalize:
 *   post:
 *     summary: Passkeys login
 *     tags:
 *      - Auth
 *      - Passkeys
 *     requestBody:
 *      description: Body to login
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              response:
 *                type: object
 *                properties:
 *                  authenticatorData:
 *                    type: string
 *                  clientDataJSON:
 *                    type: string
 *                  signature:
 *                    type: string
 *                  userHandle:
 *                    type: string
 *              id:
 *                type: string
 *              rawId:
 *                type: string
 *              type:
 *                type: string
 *              email:
 *                type: string
 *            required:
 *              - id
 *              - rawId
 *              - type
 *              - email
 *              - response
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
 *                    tokens:
 *                      type: object
 *                      properties:
 *                        accessToken:
 *                          type: string
 *                        refreshToken:
 *                          type: string
 *                    user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        role:
 *                          type: string
 *                          example: USER|DELIVERY|SERVICE_PROVIDER
 *                        email:
 *                          type: string
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
 */
router.post(
  '/login_passkeys_finalize',
  ValidatorMiddleware(ValidationType.body, {
    email: joiValidation.email,
    id: joiValidation.requiredString,
    rawId: joiValidation.requiredString,
    type: joiValidation.requiredString,
    response: {
      authenticatorData: joiValidation.requiredString,
      clientDataJSON: joiValidation.requiredString,
      signature: joiValidation.requiredString,
      userHandle: joiValidation.requiredString,
    },
  }),
  userControllerInstance.loginPasskeysFinalize,
);

/**
 * @openapi
 * /login:
 *   post:
 *     summary: Login
 *     tags:
 *      - Auth
 *     requestBody:
 *      description: Body to login
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *              password:
 *                type: string
 *            required:
 *              - email
 *              - password
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
 *                    tokens:
 *                      type: object
 *                      properties:
 *                        accessToken:
 *                          type: string
 *                        refreshToken:
 *                          type: string
 *                    user:
 *                      type: object
 *                      properties:
 *                        id:
 *                          type: integer
 *                        role:
 *                          type: string
 *                          example: USER|DELIVERY|SERVICE_PROVIDER
 *                        email:
 *                          type: string
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
  '/login',
  ValidatorMiddleware(ValidationType.body, {
    email: joiValidation.email,
    password: joiValidation.password,
  }),
  userControllerInstance.login,
);

/**
 * @openapi
 * /logout:
 *   post:
 *     summary: Logout
 *     tags:
 *      - Auth
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
 */
router.post('/logout', AuthMiddleware, userControllerInstance.logout);

/**
 * @openapi
 * /refresh:
 *   post:
 *     summary: Refresh
 *     tags:
 *      - Auth
 *     requestBody:
 *      description: Body to refresh
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              refreshToken:
 *                type: string
 *            required:
 *              - refreshToken
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
 *                    accessToken:
 *                      type: string
 *                    refreshToken:
 *                      type: string
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
  '/refresh',
  ValidatorMiddleware(ValidationType.body, {
    refreshToken: Joi.string().required(),
  }),
  userControllerInstance.refresh,
);

/**
 * @openapi
 * /forget_password:
 *   post:
 *     summary: Forget password
 *     tags:
 *      - Auth
 *     requestBody:
 *      description: Body to forget password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *            required:
 *              - email
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
 *                    message:
 *                      type: string
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
  '/forget_password',
  ValidatorMiddleware(ValidationType.body, {
    email: joiValidation.email,
  }),
  userControllerInstance.forgetPassword,
);

/**
 * @openapi
 * /recover_password:
 *   post:
 *     summary: Recover password
 *     tags:
 *      - Auth
 *     requestBody:
 *      description: Body to recover password
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              token:
 *                type: string
 *              password:
 *                type: string
 *              repeat_password:
 *                type: string
 *            required:
 *              - token
 *              - password
 *              - repeat_password
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
  '/recover_password',
  ValidatorMiddleware(ValidationType.body, {
    token: Joi.string().required(),
    password: joiValidation.password,
    repeat_password: Joi.string().required().valid(Joi.ref('password')),
  }),
  userControllerInstance.recoverPassword,
);

export default router;
