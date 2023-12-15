let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //按照创建时间降序
    var sql = "select createTime from AT18882E1616F80005.AT18882E1616F80005.servbill order by createTime desc";
    //查询结果集
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    if (res.length > 0) {
      var stime = JSON.stringify(res[0]);
      throw new Error(stime);
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });