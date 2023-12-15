let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var orgId = request.orgId;
    // 查询菜品成品卡主表数据
    var sql = "select * from GT5646AT1.GT5646AT1.menuMaintenance where org_id='" + orgId + "'";
    var result = ObjectStore.queryByYonQL(sql, "developplatform");
    var list = [];
    for (var i = 0; i < result.length; i++) {
      // 获取菜品成品卡主表菜品编码
      var menuNo = result[i].menuNo;
      // 获取菜品成品卡主表的主键
      var id = result[i].id;
      // 根据菜品成品卡子表的外键等于菜品成品卡主表的主键查询菜品成品卡主表子表数据(菜品清单维护详情)
      var sqlSon = "select * from GT5646AT1.GT5646AT1.menuListMaintenance where menuMaintenance_id = " + id + "";
      var resultSon = ObjectStore.queryByYonQL(sqlSon);
      var resultMap = {};
      // 转化卡主表菜品编码作为key,子表集合作为value返回
      resultMap[menuNo] = resultSon;
      list.push(resultMap);
    }
    return { list };
  }
}
exports({ entryPoint: MyAPIHandler });