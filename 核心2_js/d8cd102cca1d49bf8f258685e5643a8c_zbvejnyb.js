let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var idnum = request.idnum;
    //子表
    var queryBody = "select * from GT64724AT4.GT64724AT4.dakuanmingxi where ziyuanzhixingming_id='" + idnum + "'";
    var bodyres = ObjectStore.queryByYonQL(queryBody);
    if (bodyres.length > 0) {
      for (var i = 0; i < bodyres.length; i++) {
        var bodyid = bodyres[i].Projectexecutiondetails;
        var object = { id: bodyid, new5: "未引用" };
        var res = ObjectStore.updateById("GT64724AT4.GT64724AT4.zhangqi", object, "1cffde62");
      }
    }
    return { bodyres, res };
  }
}
exports({ entryPoint: MyAPIHandler });