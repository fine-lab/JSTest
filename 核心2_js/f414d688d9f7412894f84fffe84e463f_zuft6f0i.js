let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    try {
      let org = request.orgid;
      let department = request.deparId;
      var res; //返回信息
      var rsp = {
        code: 0,
        msg: "调用ys接口成功"
      };
      let sql = "select code,id,name from aa.warehouse.Warehouse where org='" + org + "' and department='" + department + "' AND locate('-商品仓',name)>0 ";
      var res = ObjectStore.queryByYonQL(sql, "productcenter");
      if (res.length > 0) {
        rsp["data"] = res[0];
      } else {
        rsp.code = 200;
      }
      return {
        rsp
      };
    } catch (e) {
      return {
        rsp: {
          code: 500,
          msg: e.message
        }
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});