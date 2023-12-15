let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let id = request.id;
    let func1 = extrequire("AT15B1FC5208300004.myluoyangconfig.myconfig");
    let config = func1.execute();
    let table_config = config.table_config;
    let table_chayi_main = table_config.chayi_main_uri;
    let table_chayi_sub = table_config.chayi_sub_uri;
    //根据id查询相关调入差异单,查询主表
    var res_mian = ObjectStore.queryByYonQL("select * from " + table_chayi_main + " where id = " + id);
    var res_sub = ObjectStore.queryByYonQL("select * from " + table_chayi_sub + " where mianid = " + id);
    let res = {};
    res.main = res_mian;
    res.sub = res_sub;
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });