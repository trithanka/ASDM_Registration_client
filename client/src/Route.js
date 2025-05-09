const express = require("express");
const Router = express.Router();

//master route
const masterRoute = require('./routes/master.routes.js');
Router.use('/master', masterRoute);

module.exports = Router;