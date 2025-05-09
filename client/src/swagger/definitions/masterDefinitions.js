/**
 * @swagger
 * components:
 *   schemas:
 *     MasterResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           description: Whether the request was successful
 *           example: true
 *         message:
 *           type: string
 *           description: Response message
 *           example: Data retrieved successfully
 *         data:
 *           type: object
 *           description: The data payload
 *       required:
 *         - success
 * 
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *           example: Internal server error
 *       required:
 *         - message
 */ 