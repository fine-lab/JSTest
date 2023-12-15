let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let udiList = request.udiList; //需要修改的UDI
    let newUdiList = request.newUdiList; //反发布的UDI
    let taskObj = request.taskObj; //生成任务
    if (udiList != null && newUdiList != null && udiList.length == newUdiList.length) {
      for (let i = 0; i < newUdiList.length; i++) {
        let udiCode = udiList[i].udiCode;
        let newUdiCode = newUdiList[i].udiCode;
        let newCheckUdi = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.UDIFilev3", { UDI: newUdiCode });
        if (newCheckUdi != null && newCheckUdi.length > 0) {
          throw new Error(newUdiCode + " UDI已存在，无法反发布！");
        }
        let checkUdi = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.UDIFilev3", { UDI: udiCode });
        if (checkUdi == null || checkUdi.length == 0) {
          throw new Error(udiCode + " UDI不存在，无法反发布！");
        }
        let udi_release = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.udi_release_data_infov3", { udiCode: udiCode });
        if (udi_release == null || udi_release.length == 0) {
          throw new Error(udiCode + " UDI不存在，无法反发布！");
        }
        let aRs = newUdiCode.split("(");
        if (aRs.length === 1) {
          throw new Error(newUdiCode + " UDI码错误！");
        }
        var object = { id: checkUdi[0].id, UDI: newUdiCode };
        for (let i = 0; i < aRs.length; i++) {
          let rssub = aRs[i].substring(3);
          if (aRs[i].indexOf("01)") !== -1) {
            object.PI = newUdiCode.replace("(01)" + rssub, "");
          } else if (aRs[i].indexOf("21)") !== -1) {
            object.serialNumber = rssub;
          }
        }
        object.validateDate = taskObj.periodValidity;
        object.produceDate = taskObj.dateManufacture;
        object.batchNo = taskObj.batchNo;
        var res = ObjectStore.updateById("I0P_UDI.I0P_UDI.UDIFilev3", object, "821f4590");
        var udi_create_platform = [{ id: udiList[i].udi_create_platform_id, udi_release_data_infov3List: [{ _status: "Update", id: udi_release[0].id, udiCode: newUdiCode }] }];
        ObjectStore.updateById("I0P_UDI.I0P_UDI.udi_create_platformv3", udi_create_platform, "99f8f957");
      }
    } else {
      throw new Error("反发布失败，请重试!");
    }
    return { result: newUdiList };
  }
}
exports({ entryPoint: MyAPIHandler });