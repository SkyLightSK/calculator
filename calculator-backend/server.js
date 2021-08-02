var error = require('./src/api/middlewares/error');
var express = require('express'),
  app = express(),
  port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

var routes = require("./src/api/routes");
routes(app);

if (! module.parent) {
  app.listen(port);
}

// if error is not an instanceOf APIError, convert it.
app.use(error.converter);

// catch 404 and forward to error handler
app.use(error.notFound);

// error handler, send stacktrace only during development
app.use(error.handler);

module.exports = app

console.log("Server running on port " + port);
