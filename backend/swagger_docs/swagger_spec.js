import swaggerJsDoc from 'swagger-jsdoc';

const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Skill Bridge API Specification',
            version: '1.0.0',
            description: 'API Documentation for Skill Bridge Application',
            contact: {
                name: 'Developer',
            },
            servers: [{ url: 'http://localhost:5000' }]
        },
        components: {
            securitySchemes: {
                BearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                ApiResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: '00' },
                        data: { type: 'object' },
                        description: { type: 'string', example: 'SUCCESS' },
                        error: {
                            type: 'object',
                            properties: {
                                errorCode: { type: 'string', example: '0000' },
                                errorDescription: { type: 'string', example: 'Success.' }
                            }
                        }
                    }
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: { type: 'string', example: '01' },
                        data: { type: 'object', nullable: true, example: null },
                        description: { type: 'string', example: 'ERROR' },
                        error: {
                            type: 'object',
                            properties: {
                                errorCode: { type: 'string', example: '400' },
                                errorDescription: { type: 'string' }
                            }
                        }
                    }
                }
            }
        },
        security: [{
            BearerAuth: [],
        }],
    },
    apis: ['./Routes/*.js', './swagger_docs/**/*.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
