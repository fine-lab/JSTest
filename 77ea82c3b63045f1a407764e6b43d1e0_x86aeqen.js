let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let res = [];
    //清空旧的数据
    if (request.deptId) {
      var deleteParam = { deptId: request.deptId };
      ObjectStore.deleteByMap("AT1957625017480008.AT1957625017480008.dept_adu_list", deleteParam, "dept_adu_list");
    }
    //添加新的数据
    if (request.rowDatas && request.rowDatas.length > 0) {
      var rowDatas = JSON.parse(request.rowDatas);
      res = ObjectStore.insertBatch("AT1957625017480008.AT1957625017480008.dept_adu_list", rowDatas, "dept_adu_list");
    }
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });