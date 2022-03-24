const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cors = require('cors')
const  cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require("mongoose")

const indexRouter = require('./routes/index');
const fileUpload = require('express-fileupload')


const app = express({limit: '50mb'});
require('dotenv').config('./env')

// view engine setup
app.use(fileUpload({
  useTempFiles: true
}))

app.use(logger(':method :url :status :res[content-length] - :response-time ms', {
  skip: function (req, res) { return res.statusCode < 400 }
}));
app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
//Connect to db
mongoose.connect(process.env.MONGODB_URL, err =>{
  if(err) throw err;
  console.log('Connected to MongoDB')
})

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
