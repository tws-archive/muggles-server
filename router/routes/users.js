var mongoose = require('mongoose');
var express = require('express');
var router = express.Router();
var Checkpoint = mongoose.model('Checkpoint');
var CheckpointUsed = mongoose.model('CheckpointUsed');
var Course = mongoose.model('Course');
var User = mongoose.model('User');
var _ = require('lodash');
var LocalStrategy = require('passport-local').Strategy;
module.exports = function (passport) {

  passport.use(new LocalStrategy(
    function(username, password, done) {
      process.nextTick(function () {
        User.findOne({'username': username}, function(err, user) {
          if (err) { return done(err); }
          if (!user) { return done(null, false, { message: 'Unknown user ' + username }); }
          if (user.password != password) { return done(null, false, { message: 'Invalid password' }); }
          return done(null, user);
        })
      });
    }
  ));

  router.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) { return next(err) }

      if (!user) {
        return res.status(401).send(info.message);
      }

      req.logIn(user, function(err) {
        if (err) { return next(err); }
        return res.send(user);
      });

    })(req, res, next);
  });

  //router.post('/signup',
  //  passport.authenticate('signup'),
  //
  //  function(req, res) {
  //
  //      var result = {
  //        massage: 'signup success',
  //        redirect: 'views/courses.html',
  //        data: ''
  //      };
  //      res.send(result);
  //
  //    console.log('注册成功');
  //  });


  //router.post('/signup', function(req, res) {
  //  var username = req.body.username;
  //  var password = req.body.password;
  //
  //  var massage = '';
  //  var redirect = '';
  //  User.findOne({ 'username' :  username }, function(err, user) {
  //    if (err){
  //      massage = '注册错误' + err;
  //      console.log('Error in SignUp: '+err);
  //      res.send(massage);
  //    }
  //
  //    if (user) {
  //      massage = '用户已存在' + username;
  //      console.log('User already exists with username: '+username);
  //      res.send(massage);
  //    } else {
  //      var newUser = new User();
  //
  //      newUser.username = username;
  //      newUser.password = password;
  //
  //      newUser.save(function(err) {
  //        if (err){
  //          massage = '保存用户错误' + err;
  //          console.log('Error in Saving user: '+err);
  //          throw err;
  //        }
  //        massage = '用户注册成功';
  //        redirect = 'views/courses.html';
  //        result = {massage: massage, redirect: redirect};
  //        console.log('User Registration succesful');
  //        res.send(result);
  //      });
  //    }
  //  });
  //});


  router.get('/course/checkpoints', function (req, res) {
    console.log('/user/course/checkpoints');
    //var CheckpointType = mongoose.model('CheckpointType');
    //var checkpointType = new CheckpointType();
    //checkpointType.name = '默认类型';
    //var checkpoint = new Checkpoint();
    //checkpoint.name = '牛顿第一定律';
    //checkpoint.type = checkpointType._id;
    //checkpoint.save(function(err) {
    //  if(err) {
    //    console.log('save checkpoint err' + err);
    //    throw err;
    //  }
    //});
    //
    //var checkpoint2 = new Checkpoint();
    //checkpoint2.type = checkpointType._id;
    //
    //checkpoint2.name = '牛顿第二定律';
    //checkpoint2.save(function(err) {
    //  if(err) {
    //    console.log('save checkpoint err' + err);
    //    throw err;
    //  }
    //});
    //
    //var checkpoint3 = new Checkpoint();
    //checkpoint3.name = '牛顿第三定律';
    //checkpoint3.type = checkpointType._id;
    //
    //checkpoint3.save(function(err) {
    //  if(err) {
    //    console.log('save checkpoint err' + err);
    //    throw err;
    //  }
    //});

    Checkpoint.find({}, function (err, checkpoints) {
      res.send(checkpoints);
    });
  });

  router.get('/courses', function (req, res) {
    console.log('api/user/courses');
    //var course = new Course();
    //
    //course.name = '面向对象';
    //course.save(function (err) {
    //  if(err) {
    //    throw err;
    //  }
    //});

    Course.find({}, function (err, courses) {
      res.send(courses);
    })

  });

  router.get('/courses/:id', function (req, res){
    console.log(req.params.id);
    Course.findById(req.params.id, function (err, course) {
      if(err) console.log('获取失败');

      res.send(course);
    });
  });

  router.patch('/course/checkpoints', function (req, res) {
    _.forEach(req.body, function (checkpointId) {
      Checkpoint.findById(checkpointId, function (err, checkpoint) {
        if (err) console.log('修改失败');
        console.log(checkpoint);
        checkpoint.checked = true;

        checkpoint.save(function (err) {
          console.log('修改成功');
        });

      });
    });
  });

  return router;
};
