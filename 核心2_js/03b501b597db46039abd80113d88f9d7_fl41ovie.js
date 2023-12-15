let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const { data } = request;
    // 查询是否已存在该记录
    var querySql = "select * from GT41951AT266.GT41951AT266.nd_qq_ybaoming_hd where huodongid='" + data.id + "'";
    var res = ObjectStore.queryByYonQL(querySql);
    var addRes = "";
    // 如果不存在则添加
    if (res && res.length <= 0) {
      data.huodongid = data.id;
      delete data.id;
      delete data.nd_qq_hdliuchengList;
      addRes = ObjectStore.insertBatch("GT41951AT266.GT41951AT266.nd_qq_ybaoming_hd", [data], "7823e95bList");
    }
    var newRes = addRes ? addRes : res;
    return { res: newRes };
  }
}
exports({ entryPoint: MyAPIHandler });