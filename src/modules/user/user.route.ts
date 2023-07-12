import { Router } from 'express';
import { Route } from 'interfaces';
import { UserController } from './user.controller';

import { isAuthenticated } from 'middlewares/auth.middleware';
import { ValidationPipe } from 'middlewares/request-validation.middleware';
import { UpdateUserDto } from './dtos/updateUser.dto';

export class UserRoute implements Route {
  public readonly path = '/user';
  public router = Router();
  public userController = new UserController();
  constructor() {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    /**
     *  @openapi
     *  '/user/me':
     *  get:
     *   tags:
     *    - User
     *   security:
     *     - bearerAuth: []
     *   summary: get logged in user
     *   responses:
     *     200:
     *       description: Successfully logged out
     *       $ref : '#/components/schemas/CreateUserResponse'
     *     204:
     *       description: Successfully logged out
     *     400:
     *       description: Bad request
     *     401:
     *       $ref : '#/components/responses/401'
     *
     */

    this.router.get(`${this.path}/me`, isAuthenticated, this.userController.getMyProfileHandler);
    this.router.put(
      `${this.path}/activate`,
      isAuthenticated,
      ValidationPipe(UpdateUserDto),
      this.userController.activateMyProfileHandler,
    );
  }
}
