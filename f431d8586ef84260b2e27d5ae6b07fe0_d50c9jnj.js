let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 查询合同号+算力物理+开启，是否唯一
    // 校验唯一性，算力服务产品编码+合同号+已启用 唯一
    if (request.status == "1") {
      // 启用时校验
      let sql = "select count(1) co from AT1720668416580001.AT1720668416580001.suanliProductPrice ";
      sql += " where suanliId = '" + request.suanliId + "' ";
      sql += " and contractNum = '" + request.contractNum + "' ";
      sql += " and status = '1' ";
      sql += " and id != '" + request.id + "' ";
      var res = ObjectStore.queryByYonQL(sql);
      if (res && res.length == 1 && res[0].co > 0) {
        throw new Error("算力服务产品编码：" + request.suanliType + ",合同号：" + request.contractNum + "已经开启，请勿重复操作！");
      }
    }
    var object = { id: request.id, status: request.status, _status: "Update" };
    var res = ObjectStore.updateById("AT1720668416580001.AT1720668416580001.suanliProductPrice", object, "yb068a76c0");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });