let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = request.code;
    let res = {};
    let func1 = extrequire("AT15CFB6F808300003.zcPeizhi.myconfig");
    let config = func1.execute();
    let table_config = config.table_config;
    let table_chayi_main = table_config.chayi_main_uri;
    let table_chayi_sub = table_config.chayi_sub_uri;
    //根据id查询相关调入差异单,查询主表
    let res_main = ObjectStore.queryByYonQL("select * from " + table_chayi_main + " where code = " + code);
    if ((res_main == null) | (res_main.length == 0)) {
      res = {
        code: -1,
        message: "未找到相关差异单"
      };
    } else {
      res.main = res_main[0];
      let id = res.main.id;
      let res_sub = ObjectStore.queryByYonQL("select * from " + table_chayi_sub + " where zc_daiobochayi_id = " + id);
      res.sub = res_sub;
      res.code = 0;
      res.message = "";
    }
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });