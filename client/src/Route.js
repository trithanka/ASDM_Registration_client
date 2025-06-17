const express = require("express");
const Router = express.Router();

//master route
const masterRoute = require('./routes/master.routes.js');
Router.use('/master', masterRoute);

//Get Route
const getRoute = require('./routes/get.routes.js');
Router.use('/get', getRoute);

//post route
const postRoute = require('./routes/post.routes.js');
Router.use('/post', postRoute);

//auth route
const authRoute = require('./routes/auth.routes.js')
Router.use('/auth',authRoute)

module.exports = Router;
