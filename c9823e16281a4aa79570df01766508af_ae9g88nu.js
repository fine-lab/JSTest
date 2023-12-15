let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //如果是第一次，数据中心不存在，则来源为生成
    //先查询 如果存在 则更新 否则新增
    let resDataList = "select * from GT22176AT10.GT22176AT10.UDIFile where UDI = '" + request.UDI + "'";
    let resDataListRs = ObjectStore.queryByYonQL(resDataList);
    if (typeof resDataListRs == "undefined" || resDataListRs.length === 0) {
      resDataListRs = [];
    }
    var proRes;
    //有数据 则更新
    if (resDataListRs.length <= 0) {
      proRes = ObjectStore.insert("GT22176AT10.GT22176AT10.UDIFile", request.udiDataObject, "UDIFile"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
    }
    return { proRes };
  }
}
exports({ entryPoint: MyAPIHandler });