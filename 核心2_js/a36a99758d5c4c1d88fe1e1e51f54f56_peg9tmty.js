let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 购货者id
    var buyerCode = request.buyerCode;
    // 购货者名称
    var buyerName = request.buyerName;
    // 根据id查询购货者信息
    var buyerSql = "select * from AT161E5DFA09D00001.AT161E5DFA09D00001.Buyers where id = '" + buyerCode + "' and BuyersName ='" + buyerName + "'";
    var buyerRes = ObjectStore.queryByYonQL(buyerSql, "developplatform");
    if (buyerRes.length > 0) {
      // 获取购货者的启用状态
      var enable = buyerRes[0].enable;
      if (enable == 1) {
        // 购货者属于启用状态, 获取许可证日期
        var LicenseValidity = buyerRes[0].LicenseValidity;
        var nowDate = new Date();
        var licenseDate = new Date(LicenseValidity);
        var dateNow = new Date(nowDate);
        if (licenseDate > dateNow) {
        } else {
          throw new Error("购货者经营许可证未在有效期内!");
        }
      } else {
        // 购货者未启用
        throw new Error("购货者未启用!");
      }
    } else {
      throw new Error("购货者档案中没有该购货者编码+购货者名称的数据");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });