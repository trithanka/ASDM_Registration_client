# Candidate Public Registration API

API for candidate public registration.

## Setup and Installation

1. Install dependencies:
   ```
   npm install
   ```

2. Run the development server:
   ```
   npm run dev
   ```

3. Access the API at:
   ```
   http://localhost:6161
   ```

## API Documentation with Swagger

This project includes comprehensive API documentation using Swagger/OpenAPI.

### Accessing Swagger Documentation

- **Swagger UI**: [http://localhost:6161/api-docs](http://localhost:6161/api-docs)
- **Swagger JSON**: [http://localhost:6161/api-docs.json](http://localhost:6161/api-docs.json)

### Documentation Structure

The Swagger documentation is organized in a modular way for better maintainability:

- `src/swagger/swaggerConfig.js`: Main configuration
- `src/swagger/swaggerSetup.js`: Express integration
- `src/swagger/tags/`: API grouping tags
- `src/swagger/definitions/`: Schema definitions
- `src/swagger/paths/`: API endpoint documentation

### How to Document Your API

1. **For Controllers/Routes**: Add JSDoc comments with `@swagger` annotation directly to your controller or route files:

   ```javascript
   /**
    * @swagger
    * /api/endpoint:
    *   get:
    *     summary: Endpoint description
    *     tags: [Category]
    *     responses:
    *       200:
    *         description: Success response
    */
   const myController = (req, res) => {
     // Implementation
   };
   ```

2. **For Schemas/Models**: Add new definition files in `src/swagger/definitions/`:

   ```javascript
   /**
    * @swagger
    * components:
    *   schemas:
    *     ModelName:
    *       type: object
    *       properties:
    *         field:
    *           type: string
    */
   ```

3. **For New API Categories**: Add new tag files in `src/swagger/tags/`:

   ```javascript
   /**
    * @swagger
    * tags:
    *   name: Category
    *   description: Category description
    */
   ```

## License

ISC 