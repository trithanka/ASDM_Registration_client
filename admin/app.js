const express = require('express');
// const logger = require('./utils/logger'); // Adjust the path as necessary
const app = express();
const port = 6262;
// const bodyParser = require('body-parser');
// const { cryptoService } = require('./utils/cryptoService'); // Import the cryptoService function
 const cors = require('cors');
// // const { decryptMiddleware } = require('./middlleware/decrypt.middleware');
// const setupSwagger = require('./src/swagger/swaggerSetup');

app.use(cors({
    origin: '*'
}));
  
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.raw());

// Middleware to decrypt incoming requests
// app.use(decryptMiddleware);

// Setup Swagger documentation
// setupSwagger(app);


app.get('/', (req, res) => {
  res.send('Hello from admin---');
});

//https://public-registration.skillmissionassam.org/nw/api-docs

app.listen(port, () => {
  // logger.info(`Server is running on port , ${port}`);
  // logger.info(`Swagger documentation available at http://localhost:${port}/api-docs`);
  console.log(`Server is running on port ${port}------`);
});
