let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var name = request.name;
    var data = {
      message: "",
      code: null,
      body: {}
    };
    var res;
    var sql = "select name,addressdetail FROM AT16388E3408680009.AT16388E3408680009.mzgd_addressinfo where name='" + name + "'";
    //实体查询
    res = ObjectStore.queryByYonQL(sql);
    if (res.length > 0) {
      data.message = "查询成功！";
      data.code = 200;
      data.body = res;
    } else {
      data.message = "查询失败！";
      data.code = 999;
      data.body = null;
    }
    return { data };
  }
}
exports({ entryPoint: MyAPIHandler });