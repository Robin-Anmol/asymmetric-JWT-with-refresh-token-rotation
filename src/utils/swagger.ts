import { Application, Request, Response } from 'express';
import swaggerJSdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { version } from '../../package.json';
import { getConfig } from 'config';
import { logger } from 'lib/logger';

export function setupSwagger(app: Application) {
  const swaggerOptions: swaggerJSdoc.Options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: 'Express-postgresql-typescript-template-Docs',
        version,
      },
      components: {
        schemas: {
          LoginWithEmailInput: {
            type: 'object',
            require: ['email'],
            properties: {
              email: {
                type: 'string',
                description: 'we will we send you otp on your email address',
              },
            },
            example: {
              email: 'example@example.com',
            },
          },
          LoginWithEmailResponse: {
            type: 'object',
            properties: {
              email: {
                type: 'string',
              },
              hash: {
                type: 'string',
              },
            },
          },
          verifyOtp: {
            type: 'object',
            description: 'Enter the email with hash and otp we have sent on  your email address',
            require: ['email', 'hash', 'otp'],
            properties: {
              email: {
                type: String,
              },
              hash: {
                type: String,
              },
              otp: {
                type: Number,
              },
            },
          },

          userResponse: {
            type: 'object',
            properties: {
              userId: {
                type: String,
              },
              email: {
                type: String,
              },
              name: {
                type: String,
              },
              avatar: {
                type: String,
              },
              provider: {
                type: String,
              },
              googleId: {
                type: String,
              },
              activated: {
                type: Boolean,
              },
              updatedAt: {
                type: String,
              },
              createdAt: {
                type: String,
              },
            },
          },
          CreateUserResponse: {
            type: 'object',
            description: 'New User created successfully',
            properties: {
              user: {
                $ref: '#/components/schemas/userResponse',
              },
              accessToken: {
                type: String,
              },
            },
          },
          NewAccessToken: {
            type: 'object',
            description: ' New Access Token created successfully',
            properties: {
              accessToken: {
                type: String,
              },
            },
          },
        },

        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
          },
        },
        responses: {
          400: {
            description: 'Missing API key - include it in the Authorization header',
            contents: 'application/json',
          },
          401: {
            description: 'Unauthorized - incorrect API key or incorrect format',
            contents: 'application/json',
          },
          404: {
            description: 'Not found - the book was not found',
            contents: 'application/json',
          },
        },
      },
      security: [
        {
          bearerAuth: [],
        },
      ],
      servers: [
        {
          url: `http://${getConfig().server.host}:${getConfig().server.port}/api/v1/`,
          description: 'Development server',
        },
      ],
    },
    apis: ['./src/modules/**/*.route.ts'],
  };

  const swaggerSpec = swaggerJSdoc(swaggerOptions);
  app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  app.get('/api/v1/docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });

  logger.info(`Docs available at http://${getConfig().server.host}:${getConfig().server.port}/api/v1/docs`);
}
