let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let appContext = AppContext();
    let obj = JSON.parse(appContext);
    let tid = obj.currentUser.tenantId;
    //如果不是南京元素租户
    if (tid != "n8zwyejt" && tid != "kegf1e24") {
      return { err: "非南京租户,非沙箱" };
    }
    let id = request.id;
    let yonql = "select id,code from GT22176AT10.GT22176AT10.sy01_saleoutstofhv6 where source_id = '" + id + "'";
    let res = ObjectStore.queryByYonQL(yonql, "sy01");
    if (res.length == 0) {
      return { code: "" };
    }
    if (res.length > 0) {
      return { code: res[0].code };
    }
  }
}
exports({ entryPoint: MyAPIHandler });