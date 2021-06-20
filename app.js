var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var admin = require('firebase-admin');

var indexRouter = require('./routes/index');
//var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

var serviceAccount = require("./config/fleek-df27e-firebase-adminsdk-3jknt-ec39da3258.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
/*
uid='duDgKLOM3igB18tDAjsqmtJOSXe2'
admin
  .auth()
  .getUser(uid)
  .then((userRecord) => {
    // See the UserRecord reference doc for the contents of userRecord.
    console.log(`Successfully fetched user data: ${userRecord.toJSON()}`);
    console.log(userRecord);
  })
  .catch((error) => {
    console.log('Error fetching user data:', error);
  });
  */

/*
idToken='eyJhbGciOiJSUzI1NiIsImtpZCI6ImRjNGQwMGJjM2NiZWE4YjU0NTMzMWQxZjFjOTZmZDRlNjdjNTFlODkiLCJ0eXAiOiJKV1QifQ.eyJuYW1lIjoiU0VPTkdIWVVOIEhXQU5HIiwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hLS9BT2gxNEdqUVB5ajA2YjRaMm9vZ1ZJQkJDRE4wdmtpZnZuSzFzQlVteDgtYz1zOTYtYyIsImlzcyI6Imh0dHBzOi8vc2VjdXJldG9rZW4uZ29vZ2xlLmNvbS9mbGVlay1kZjI3ZSIsImF1ZCI6ImZsZWVrLWRmMjdlIiwiYXV0aF90aW1lIjoxNjI0MTcwNDEwLCJ1c2VyX2lkIjoiYXc1U01NV2hwc05vOERUWWpzV2Fob2VXRTNIMyIsInN1YiI6ImF3NVNNTVdocHNObzhEVFlqc1dhaG9lV0UzSDMiLCJpYXQiOjE2MjQxNzA0MTAsImV4cCI6MTYyNDE3NDAxMCwiZW1haWwiOiJ4YXZod2FuZ0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJnb29nbGUuY29tIjpbIjEwNTg2NzczNjA1NTgzMDc3ODk3NCJdLCJlbWFpbCI6WyJ4YXZod2FuZ0BnbWFpbC5jb20iXX0sInNpZ25faW5fcHJvdmlkZXIiOiJnb29nbGUuY29tIn19.LSdFPP9tXEVOLHsXth0PAGxgtncjg6VLFGQwDzKfcKU81o9j-PImGexxBKFEDLLq5-z5wJzRs7lxYq7_AibBMxVNB7oaNxVJ-qDcBjl1C1GAVIfkZkjgQVaV9lCQ4kOBmRLKia8Pgc2BjT5mwVVsWO82fZ15fRHalEBkklrGfHjSPMUJKXitWgaT_Ap0S5urB5Lxf2Ue5yLr773d1_P3o0kgqcwNEZJ7--c24RgEvv-fzu0_ee9uN-s_V5oMbRW1-4nf56Ftow5mU8g1KEfA8A04XZLtWbplRuMw8XJzvovjDRyt_r3kQlmNQ8Sp6M6VCX2QUyXqRWsLmi_TsmG4zQ';
admin
  .auth()
  .verifyIdToken(idToken)
  .then((decodedToken) => {
    const uid = decodedToken.uid;
    console.log(uid);
    // ...
  })
  .catch((error) => {
    // Handle error
    console.log(error);
  });
*/

app.get('/authuser', async(req, res)=>{
  idToken = req.headers.authorization;
  admin
    .auth()
    .verifyIdToken(idToken)
    .then((decodedToken) => {
      const uid = decodedToken.uid;
      admin
        .auth()
        .getUser(uid)
        .then((userRecord) => {
          res.send("Welcome " + userRecord.providerData[0].displayName)
          console.log(userRecord);
        })
        .catch((error) => {
          console.log('Error fetching user data:', error);
        });
      // ...
    })
    .catch((error) => {
      res.send("SORRY. You are not in our user list.")
      // Handle error
      console.log(error);
    });
});


app.use('/', indexRouter);
//app.use('/users', usersRouter);


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
