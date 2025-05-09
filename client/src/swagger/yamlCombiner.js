const fs = require('fs');
const path = require('path');
const YAML = require('js-yaml');

/**
 * Combine multiple YAML files into a single Swagger document
 * @returns {Object} Combined Swagger document
 */
function combineYamlFiles() {
  try {
    // Base swagger document with common info
    const baseYamlPath = path.join(__dirname, 'yaml', 'base.yaml');
    const swaggerDoc = YAML.load(fs.readFileSync(baseYamlPath, 'utf8'));
    
    // Initialize paths if not present
    if (!swaggerDoc.paths) {
      swaggerDoc.paths = {};
    }
    
    // Load route YAML files
    const routesDir = path.join(__dirname, 'yaml', 'routes');
    if (fs.existsSync(routesDir)) {
      const routeFiles = fs.readdirSync(routesDir).filter(file => file.endsWith('.yaml'));
      
      for (const file of routeFiles) {
        const routeYamlPath = path.join(routesDir, file);
        const routeDoc = YAML.load(fs.readFileSync(routeYamlPath, 'utf8'));
        
        // Merge paths from route file
        if (routeDoc.paths) {
          swaggerDoc.paths = {
            ...swaggerDoc.paths,
            ...routeDoc.paths
          };
        }
        
        // Merge components/schemas if present
        if (routeDoc.components && routeDoc.components.schemas) {
          if (!swaggerDoc.components) swaggerDoc.components = {};
          if (!swaggerDoc.components.schemas) swaggerDoc.components.schemas = {};
          
          swaggerDoc.components.schemas = {
            ...swaggerDoc.components.schemas,
            ...routeDoc.components.schemas
          };
        }
      }
    }
    
    return swaggerDoc;
  } catch (error) {
    console.error('Error combining YAML files:', error);
    throw error;
  }
}

module.exports = combineYamlFiles; 