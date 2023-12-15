let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    // 先去udi数据中心查询 如果不存在当前udi，则添加， 根据查询的id添加当前记录 UDI追踪
    let resDataList = "select * from ISVUDI.ISVUDI.UDIFilev2 where UDI = '" + request.UDI + "'";
    let resFileRs = ObjectStore.queryByYonQL(resDataList);
    if (resFileRs.length === 0 || typeof resFileRs == "undefined") {
      resFileRs = [];
    }
    let proRes;
    if (resFileRs.length == 0) {
      proRes = ObjectStore.insert("ISVUDI.ISVUDI.UDIFilev2", request.udiDataObject, "ce60fff3"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
    } else {
      request.udiDataObject.id = resFileRs[0].id;
      proRes = ObjectStore.updateById("ISVUDI.ISVUDI.UDIFilev2", request.udiDataObject, "ce60fff3");
    }
    return { proRes };
  }
}
exports({ entryPoint: MyAPIHandler });