let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let data = { code: "999", msg: "", data: [] };
    let ids = request.id; //单据id
    if (ids == undefined || ids == null || ids.length == 0) {
      data.msg = "id不能为空";
      return data;
    }
    if (ids.length > 10) {
      data.msg = "查询条件最大查10条";
      return data;
    }
    let kitIds = "";
    ids.forEach((kit) => {
      let kitId = "'" + kit + "',";
      kitIds += kitId;
    });
    kitIds = "(" + substring(kitIds, 0, kitIds.length - 1) + ")";
    let sql = "select verifystate,id from AT1740DE240888000B.AT1740DE240888000B.ecologicalservicecode where id in" + kitIds;
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    data.code = "200";
    data.msg = "success";
    data.data = res;
    return data;
  }
}
exports({ entryPoint: MyAPIHandler });