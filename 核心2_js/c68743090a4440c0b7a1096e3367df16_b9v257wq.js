let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let rsp = {
      code: "200",
      msg: "",
      dataInfo: ""
    };
    try {
      let md = request.md; //门店id
      let sql = "select crm,shopcode,taCode,taName from AT18623B800920000A.AT18623B800920000A.crmMap where 1=1 and dr=0 and md=" + md;
      let res = ObjectStore.queryByYonQL(sql, "developplatform");
      if (res.length > 0) {
        rsp.dataInfo = res[0];
      } else {
        throw new Error(" 当前按钮只有对接crm会员系统门店可用 ！");
      }
    } catch (ex) {
      rsp.code = 500;
      rsp.msg = ex.message;
    }
    return rsp;
  }
}
exports({ entryPoint: MyAPIHandler });