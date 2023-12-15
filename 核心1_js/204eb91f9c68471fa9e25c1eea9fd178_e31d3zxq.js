let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request.orgId;
    let type = request.type;
    let objId = request.objId;
    let name = request.name;
    //查询客户的
    if (type == "customer") {
      let yonql = "select id,businesserName from GT22176AT10.GT22176AT10.SY01_osalesmanv2 where businesserName = '" + name + "' and ocustomer = '" + objId + "'";
      let res = ObjectStore.queryByYonQL(yonql, "sy01");
      if (res.length == 1) {
        return { code: 200, info: res[0] };
      }
      if (res.length > 1) {
        return { code: 777, errMsg: "该客户关联业务员：" + name + ",有多个,请手动选择" };
      }
      if (res.length == 0) {
        let json = {
          //使用组织
          org_id: orgId,
          businesserName: name,
          yewuyuanleixing: 1,
          ocustomer: objId
        };
        let insertRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_osalesmanv2", json, "fed3e035");
        return { code: 200, info: insertRes };
      }
    }
    //查询供应商的
    if (type == "supplier") {
      let yonql = "select id,businesserName from GT22176AT10.GT22176AT10.SY01_osalesmanv2 where businesserName = '" + name + "' and osupplier = '" + objId + "'";
      let res = ObjectStore.queryByYonQL(yonql, "sy01");
      if (res.length == 1) {
        return { code: 200, info: res[0] };
      }
      if (res.length > 1) {
        return { code: 777, errMsg: "该供应商关联业务员：" + name + ",有多个,请手动选择" };
      }
      if (res.length == 0) {
        let json = {
          //使用组织
          org_id: orgId,
          businesserName: name,
          yewuyuanleixing: 3,
          osupplier: objId
        };
        let insertRes = ObjectStore.insert("GT22176AT10.GT22176AT10.SY01_osalesmanv2", json, "fed3e035");
        return { code: 200, info: insertRes };
      }
    }
    return { code: 999, info: "getSalesManInfo函数报错，请联系相关人员" };
  }
}
exports({ entryPoint: MyAPIHandler });