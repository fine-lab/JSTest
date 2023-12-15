let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let yonql = "select id from ISY_2.ISY_2.SY01_control_transa_type where code='000001'";
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    let obj = {
      id: 1660738869856305155 //res[0].id
    };
    let transatypes = ObjectStore.selectById("ISY_2.ISY_2.SY01_control_transa_type", obj, "", "sy01");
    return { transaTypes: transatypes };
  }
}
exports({ entryPoint: MyAPIHandler });