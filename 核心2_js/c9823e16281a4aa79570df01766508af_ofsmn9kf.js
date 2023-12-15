let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //先查询 如果存在 则更新 否则新增
    var object = { UDI: request.UDI }; //要查询实体的id
    var resDataList = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.UDIFile", object); // 参数1：数据建模的URI  参数2：查询的id对象
    var proRes;
    //有数据 则更新
    if (resDataList.length > 0) {
      request.udiDataObject.id = resDataList[0].id;
      proRes = ObjectStore.updateById("GT22176AT10.GT22176AT10.UDIFile", request.udiDataObject, "UDIFile");
    } else {
      proRes = ObjectStore.insert("GT22176AT10.GT22176AT10.UDIFile", request.udiDataObject, "UDIFile"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
    }
    return { proRes };
  }
}
exports({ entryPoint: MyAPIHandler });