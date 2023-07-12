import { AuthController } from './controllers/auth.controller';
import { Router } from 'express';
import type { Route } from '../../interfaces/route.interface';
import { ValidationPipe } from '../../middlewares/request-validation.middleware';
import { AuthDto } from './dtos/auth.dto';
import { VerifyOtpDto } from './dtos/verifyotp.dto';
import { GoogleController } from './controllers/google.controller';
import { RefreshAccessToken } from './controllers/refreshAccessToken.controller';
import { isAuthenticated } from 'middlewares/auth.middleware';

export class AuthRoute implements Route {
  public readonly path = '/auth';
  public router = Router();
  public authController = new AuthController();
  public googleController = new GoogleController();
  public refreshAccessToken = new RefreshAccessToken();
  constructor() {
    this.initializeRoutes();
  }
  private initializeRoutes() {
    /**
     * @openapi
     * '/auth/login':
     *  post:
     *   tags:
     *    - Authentication
     *   summary: Authentication based on email address
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *      schema:
     *        $ref : '#/components/schemas/LoginWithEmailInput'
     *   responses:
     *     200:
     *       description: Success
     *       content:
     *         application/json:
     *          schema:
     *            $ref : '#/components/schemas/LoginWithEmailResponse'
     *     400:
     *       description: Bad request
     *
     */
    this.router.post(`${this.path}/login`, ValidationPipe(AuthDto), this.authController.EmailSignUpHandler);

    /**
     *  @openapi
     *  '/auth/verify':
     *  post:
     *   tags:
     *    - Authentication
     *   summary: Enter otp for email verification
     *   requestBody:
     *    required: true
     *    content:
     *     application/json:
     *        schema:
     *          $ref : '#/components/schemas/verifyOtp'
     *   responses:
     *     200:
     *       description: Success
     *       content:
     *         application/json:
     *          schema:
     *            $ref : '#/components/schemas/CreateUserResponse'
     *     400:
     *       description: Bad request
     *
     */

    this.router.post(`${this.path}/verify`, ValidationPipe(VerifyOtpDto), this.authController.VerifyOtpHandler);

    /**
     *  @openapi
     *  '/auth/refresh-token':
     *  get:
     *   tags:
     *    - Authentication
     *   summary: this route generates a new access token
     *   responses:
     *     200:
     *       description: Success
     *       content:
     *         application/json:
     *          schema:
     *            $ref : '#/components/schemas/NewAccessToken'
     *     400:
     *       description: Bad request
     *
     */

    this.router.get(`${this.path}/refresh-token`, this.refreshAccessToken.refreshAccessTokenHandler);

    /**
     *  @openapi
     *  '/auth/logout':
     *  get:
     *   tags:
     *    - Authentication
     *   security:
     *     - bearerAuth: []
     *   summary: this route generates a new access token
     *   responses:
     *     204:
     *       description: Successfully logged out
     *     400:
     *       description: Bad request
     *     401::
     *       $ref : '#/components/responses/401'
     *
     */

    this.router.get(`${this.path}/logout`, isAuthenticated, this.authController.logoutHandler);

    this.router.get(`${this.path}/google`, this.googleController.signInWithgoogle);
  }
}
