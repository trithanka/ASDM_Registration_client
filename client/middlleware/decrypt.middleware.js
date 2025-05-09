const decryptMiddleware = async (req, res, next) => {
    try {
        // Decrypt the payload
        req.body = await cryptoService(req.body); // Assuming req.body contains the ciphertext
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        logger.error("Error in decryptMiddleware: " + error.message);
        return res.status(401).send('Unauthorized');
    }
};

module.exports = {
    decryptMiddleware
}