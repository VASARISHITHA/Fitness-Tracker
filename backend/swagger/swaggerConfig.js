const swaggerJSDoc = require('swagger-jsdoc');
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Fitness Tracker API Documentation',
      version: '1.0.0',
      description: 'API documentation for Fitness tracker Backend',
    },
    servers: [
      {
        url: 'http://localhost:5000',
      },
    ],
  },
  apis: ['./routes/*.js'], // This will scan all route files for Swagger comments
};
 
const swaggerSpec = swaggerJSDoc(options);
 
module.exports = swaggerSpec;