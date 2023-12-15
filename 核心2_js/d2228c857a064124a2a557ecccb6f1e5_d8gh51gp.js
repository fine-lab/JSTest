let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //判断是否有检测订单单号
    let rzrq = request.importData;
    let sql =
      "select id,srpingzhenghao,pingzhenghao from AT15F164F008080007.AT15F164F008080007.DetectOrder where dr=0 and (srpingzhenghao is not null or pingzhenghao is not null) and importData leftlike '" +
      substring(rzrq, 0, 7) +
      "'";
    var res = ObjectStore.queryByYonQL(sql, "developplatform");
    if (res.length > 0) {
      throw new Error("已存在凭证号，不可成本计算！");
    }
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });