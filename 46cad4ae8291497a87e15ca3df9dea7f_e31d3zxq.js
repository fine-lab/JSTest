let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let yonql = "select id from GT22176AT10.GT22176AT10.t_sy01_lpholderv3 where ip_name = '" + request.name + "'";
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    if (res.length >= 1) {
      return { code: 777, errMsg: "已存在相同名称的上市许可持有人" };
    }
    if (res.length == 0) {
      let json = {
        //使用组织
        org_id: orgId,
        ip_name: request.name,
        legalperson: request.legalperson,
        quaperson: request.quaperson,
        description: request.description
      };
      let insertRes = ObjectStore.insert("GT22176AT10.GT22176AT10.t_sy01_lpholderv3", json, "4e371acc");
      return { code: 200, info: insertRes };
    }
  }
}
exports({ entryPoint: MyAPIHandler });