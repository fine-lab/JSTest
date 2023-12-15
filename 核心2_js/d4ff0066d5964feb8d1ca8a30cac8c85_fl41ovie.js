let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let orgId = request._orgId;
    let productConditions = request._productConditions;
    let sql = "select hw.mingchen,zuzhi,kehu,wuliao,huowei from GT7936AT362.GT7936AT362.wlckhwchild0809001 ";
    sql += "left join GT7936AT362.GT7936AT362.hwdoc hw on huowei = hw.id ";
    sql += "where wuliao in (" + productConditions + ") and zuzhi = '" + orgId + "'";
    let res = ObjectStore.queryByYonQL(sql, "developplatform");
    return { res };
    // 注意事项（详见：https://doc.yonisv.com/mybook/yonbuilder/generallink/7-/end/yonqlInfo.html）
  }
}
exports({ entryPoint: MyAPIHandler });