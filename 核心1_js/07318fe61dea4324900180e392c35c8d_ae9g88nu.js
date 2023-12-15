let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 先去udi数据中心查询 如果不存在当前udi，则添加， 根据查询的id添加当前记录 UDI追踪
    let resDataList = "select * from GT22176AT10.GT22176AT10.UDIFile where UDI = '" + request.UDI + "'";
    let resFileRs = ObjectStore.queryByYonQL(resDataList);
    if (resFileRs.length === 0 || typeof resFileRs == "undefined") {
      resFileRs = [];
    }
    //有数据 则更新
    if (resFileRs.length <= 0) {
      return { proRes };
    }
    request.udiDataObject.UDIFile_id = resFileRs[0].id;
    let proRes = ObjectStore.insert("GT22176AT10.GT22176AT10.UDITrack", request.udiDataObject, "UDITrack"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
    return { proRes };
  }
}
exports({ entryPoint: MyAPIHandler });