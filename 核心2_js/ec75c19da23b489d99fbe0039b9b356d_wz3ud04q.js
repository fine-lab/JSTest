let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let resDataList = "select * from ISVUDI.ISVUDI.UDIFilev2 where UDI = '" + request.UDI + "'";
    let resDataListRs = ObjectStore.queryByYonQL(resDataList);
    if (typeof resDataListRs == "undefined" || resDataListRs.length === 0) {
      resDataListRs = [];
    }
    var proRes;
    //有数据 则更新
    if (resDataListRs.length == 0) {
      proRes = ObjectStore.insert("ISVUDI.ISVUDI.UDIFilev2", request.udiDataObject, "ce60fff3"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
    }
    return { proRes };
  }
}
exports({ entryPoint: MyAPIHandler });