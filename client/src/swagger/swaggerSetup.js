const swaggerUi = require('swagger-ui-express');
const combineYamlFiles = require('./yamlCombiner');

/**
 * Initialize Swagger documentation in Express app
 * @param {Object} app - Express application instance
 */
const setupSwagger = (app) => {
  try {
    // Get combined swagger document from YAML files
    const swaggerDocument = combineYamlFiles();

    // Serve Swagger documentation UI
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
      customSiteTitle: 'Candidate Public Registration API Documentation',
    }));

    // Serve Swagger specs as JSON
    app.get('/api-docs.json', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.send(swaggerDocument);
    });

    console.log('🚀 Swagger documentation initialized at /api-docs');
  } catch (error) {
    console.error('⚠️ Error initializing Swagger documentation:', error);
  }
};

module.exports = setupSwagger; 