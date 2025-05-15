const express = require("express");
const Router = express.Router();

//master route
const masterRoute = require('./routes/master.routes.js');
Router.use('/master', masterRoute);

//Get Route
const getRoute = require('./routes/get.routes.js');
Router.use('/get', getRoute);


module.exports = Router;