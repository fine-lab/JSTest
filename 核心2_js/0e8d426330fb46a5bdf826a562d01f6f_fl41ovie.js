let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    const { data } = request;
    // 查询是否已存在该记录
    var querySql = "select * from GT41951AT266.GT41951AT266.nd_qq_lljilu where tuijianid='" + data.id + "'";
    var res = ObjectStore.queryByYonQL(querySql);
    var addRes = "";
    // 如果不存在则添加
    if (res && res.length <= 0) {
      data.nd_lljilu_basicInfoList = data.nd_tj_basicInfoList;
      data.nd_qq_lljilu_zeoutjList = data.nd_tj_zeoutjList;
      data.tuijianid = data.id;
      delete data.id;
      delete data.nd_tj_basicInfoList;
      delete data.nd_tj_zeoutjList;
      addRes = ObjectStore.insertBatch("GT41951AT266.GT41951AT266.nd_qq_lljilu", [data], "c5814daeList");
    }
    var newRes = addRes ? addRes : res;
    return { res: newRes };
  }
}
exports({ entryPoint: MyAPIHandler });