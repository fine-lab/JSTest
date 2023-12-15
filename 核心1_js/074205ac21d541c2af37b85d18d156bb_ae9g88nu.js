let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //根据类型 做不通操作 addLogs addTrack
    let typeinfo = request.typeInfo;
    //添加日志
    if ("addLogs" === typeinfo) {
      var proLogsRes = ObjectStore.insert("GT22176AT10.GT22176AT10.UDIScanRecord", request.logsObject, "UDIScanRecord"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
      return { proLogsRes };
    }
    // 先去udi数据中心查询 如果不存在当前udi，则添加， 根据查询的id添加当前记录 UDI追踪
    let resDataList = "select id from GT22176AT10.GT22176AT10.UDIFile where UDI = " + request.udiFileObject.UDI;
    let resFileRs = ObjectStore.queryByYonQL(resDataList);
    if (resFileRs.length === 0 || typeof resFileRs == "undefined") {
      resFileRs = [];
    }
    //传两条数据过来
    // 跟踪方向
    // 单据名称
    // 单据编号
    // 行号
    // 物料
    // 计量单位
    // 数量
    //有数据 则更新
    if (resFileRs.length <= 0) {
      request.udiFileObject.UDITrackList = request.udiTrackObject; //添加追溯信息
      let proRes = ObjectStore.insert("GT22176AT10.GT22176AT10.UDIFile", request.udiFileObject, "UDIFile"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
      return { proRes };
    }
    request.udiTrackObject.UDIFile_id = resFileRs[0].id;
    let proRes = ObjectStore.insert("GT22176AT10.GT22176AT10.UDITrack", request.udiTrackObject, "UDITrack"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
    return { proRes };
  }
}
exports({ entryPoint: MyAPIHandler });