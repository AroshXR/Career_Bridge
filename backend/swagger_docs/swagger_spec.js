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
        }
    },
    apis: ['./Routes/*.js', './swagger_docs/**/*.js'] // Path to the API docs
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

export default swaggerDocs;
