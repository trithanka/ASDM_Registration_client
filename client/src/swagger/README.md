# Swagger Documentation Structure

This directory contains all Swagger/OpenAPI documentation for the Candidate Public Registration API.

## Directory Structure

- `swaggerConfig.js`: Main configuration file for Swagger
- `swaggerSetup.js`: Express integration and UI setup
- `tags/`: Contains tag definitions for API grouping
- `definitions/`: Contains schema definitions/models
- `paths/`: Contains API endpoint documentation

## How to Add New Documentation

### Adding a New API Endpoint

1. Create a new file in the `paths/` directory or update an existing one
2. Use JSDoc format with `@swagger` annotation
3. Follow the OpenAPI 3.0 specification

Example:
```javascript
/**
 * @swagger
 * /api/endpoint:
 *   get:
 *     summary: Endpoint summary
 *     description: Detailed description
 *     tags: [TagName]
 *     responses:
 *       200:
 *         description: Success response
 */
```

### Adding a New Schema/Model

1. Create a new file in the `definitions/` directory or update an existing one
2. Define your schema using JSDoc format

Example:
```javascript
/**
 * @swagger
 * components:
 *   schemas:
 *     ModelName:
 *       type: object
 *       properties:
 *         property:
 *           type: string
 */
```

### Adding a New Tag

1. Create a new file in the `tags/` directory
2. Define your tag using JSDoc format

Example:
```javascript
/**
 * @swagger
 * tags:
 *   name: TagName
 *   description: Tag description
 */
```

## Accessing the Documentation

- UI: `/api-docs`
- JSON: `/api-docs.json` 