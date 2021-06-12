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

router.get('/todo/:idx', async (req, res) => {
  const idx = req.params.idx;
  // Wrong Index
  if (!(await Todo.checkData(idx))) {
    res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_TODO_FAIL));
    return;
  }
  const result = await Todo.getData(idx);
  return res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.READ_TODO_SUCCESS, result));
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

router.put("/todo/done/:idx", async(req, res) => {
  const idx = req.params.idx;
  // NULL Value Error handling
  if (!idx) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.NULL_VALUE));
      return;
  }
  // Wrong Index
  if (!(await Todo.checkData(idx))) {
      res.status(statusCode.BAD_REQUEST).send(util.fail(statusCode.BAD_REQUEST, resMessage.READ_FAIL));
      return;
  }

  result = await Todo.updateData(idx);
  // Update Fail by DB Error
  if (result.affectedRows !== 1) {
      return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.UPDATE_FAIL));
  }

  const data = await Todo.getData(idx);
  res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.UPDATE_SUCCESS, data));
});

router.delete("/todo/deleteAll", async(req, res) => {
  result = await Todo.deleteAllData();
  // Update Fail by DB Error
  if (result.affectedRows < 1) {
    return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DELETE_FAIL));
}
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
  // Update Fail by DB Error
  if (result.affectedRows !== 1) {
    return res.status(statusCode.DB_ERROR).send(util.fail(statusCode.DB_ERROR, resMessage.DELETE_FAIL));
  }
  res.status(statusCode.OK).send(util.success(statusCode.OK, resMessage.DELETE_SUCCESS, {deletedDataIdx: idx}));
});



module.exports = router;
