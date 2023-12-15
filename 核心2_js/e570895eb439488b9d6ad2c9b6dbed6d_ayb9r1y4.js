let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取生产工号
    var SCNO = request.SCNO;
    var sql = "select * from GT102917AT3.GT102917AT3.BasicInformationDetails where Productionworknumber = '" + SCNO + "'";
    var res = ObjectStore.queryByYonQL(sql);
    if (res.length != 0) {
      var sql1 = "select * from GT102917AT3.GT102917AT3.constructionof where BasicInformationDetails_id = '" + res[0].id + "'";
      var res1 = ObjectStore.queryByYonQL(sql1);
      return { res1: res1, res: res };
    } else {
      return { res1: res1, res: res };
    }
  }
}
exports({ entryPoint: MyAPIHandler });