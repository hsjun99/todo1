var express = require('express');
var router = express.Router();
let util = require('../modules/util');
let Todo = require("../models/tododata")
let statusCode = require('../modules/statusCode');
let resMessage = require('../modules/responseMessage');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/todo', async (req, res) => {
  const result = await Todo.getAllData();
  return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_TODO_SUCCESS, result));
  //await console.log(result);
  //res.send(result);
});

router.post("/todo", async(req, res) => {
  const {content} = req.body;
  if (!content) {
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
    return;
  }
  const newIdx = await Todo.postData(content);
  res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.WRITE_SUCCESS, {idx: newIdx}));
});

router.delete("/todo/deleteAll", async(req, res) => {
  result = await Todo.deleteAllData();
  res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_SUCCESS, {}));
});

router.delete("/todo/:idx", async(req, res) => {
  const idx = req.params.idx;
  // NULL Value Error handling
  if (!idx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
  }
  // Wrong Index
  if (!(await Todo.checkData(idx))) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.DELETE_FAIL));
      return;
  }

  result = await Todo.deleteData(idx);
  res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_SUCCESS, {deletedDataIdx: idx}));
});



module.exports = router;
