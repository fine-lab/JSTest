let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //根据类型 做不通操作 addLogs addTrack
    let typeinfo = request.typeInfo;
    //添加日志
    if ("addLogs" === typeinfo) {
      var proLogsRes = ObjectStore.insert("I0P_UDI.I0P_UDI.UDIScanRecordv3", request.logsObject, "1fee2040"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
      return { proLogsRes };
    }
    // 先去udi数据中心查询 如果不存在当前udi，则添加， 根据查询的id添加当前记录 UDI追踪
    let udiFileList = request.udiFileObject;
    for (let i = 0; i < udiFileList.length; i++) {
      let resDataList = "select id from I0P_UDI.I0P_UDI.UDIFilev3 where UDI = '" + udiFileList[i].UDI + "'";
      let resFileRs = ObjectStore.queryByYonQL(resDataList);
      if (resFileRs.length === 0 || typeof resFileRs == "undefined") {
        resFileRs = [];
      }
      if (resFileRs.length == 0 || resFileRs == null) {
        let proRes = ObjectStore.insert("I0P_UDI.I0P_UDI.UDIFilev3", udiFileList[i], "821f4590"); //保存数据 参数1：数据建模的URI  参数2：实体数据   参数3：表单编码
        continue;
      }
      udiFileList[i].id = resFileRs[0].id;
      let proRes = ObjectStore.updateById("I0P_UDI.I0P_UDI.UDIFilev3", udiFileList[i], "821f4590");
    }
    let rsCode = "00";
    return { rsCode };
  }
}
exports({ entryPoint: MyAPIHandler });