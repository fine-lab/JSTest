let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let code = request.code;
    // 声明是否存在 0 不存在 1：存在
    let isExistNum = 0;
    if (!request.hasOwnProperty("code")) {
      throw new Error("出库单号未获取到");
    }
    let isExistSql = "select id from AT164D981209380003.AT164D981209380003.signBack where dr=0 and Outbound='" + code + "'";
    let resIsExist = ObjectStore.queryByYonQL(isExistSql);
    if (resIsExist.length > 0) {
      isExistNum = 1;
    }
    return { isExistNum: isExistNum };
  }
}
exports({ entryPoint: MyAPIHandler });