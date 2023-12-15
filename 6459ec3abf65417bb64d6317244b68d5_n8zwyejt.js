let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sonUdiCodes = request.sonUdiCodes; //子包装UDI码列表
    let parentUdiCode = request.parentUdiCode; //父包装UDI码
    let updateList = [];
    for (let i = 0; i < sonUdiCodes.length; i++) {
      let parentUdi = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.UDIFilev3", { UDI: parentUdiCode });
      if (parentUdi == null || parentUdi.length == 0) {
        throw new Error("关联的父包装UDI码" + parentUdiCode + "不存在，请重新选择UDI！");
      }
      let sonUdiList = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.UDIFilev3", { parentUdiId: parentUdi[0].id });
      if (sonUdiCodes.length > parentUdi[0].identificationQty - sonUdiList.length) {
        throw new Error(
          "已超过父包装UDI码" +
            parentUdiCode +
            "可关联的子包装UDI码数量，父包装UDI码已关联子包装UDI码数量：" +
            sonUdiList.length +
            "，父包装UDI码剩余可关联子包装UDI码数量：" +
            (parentUdi[0].identificationQty - sonUdiList.length)
        );
      }
      let sonUdi = ObjectStore.selectByMap("I0P_UDI.I0P_UDI.UDIFilev3", { UDI: sonUdiCodes[i].udiCode });
      if (sonUdi == null || sonUdi.length == 0) {
        throw new Error("关联的子包装UDI码" + sonUdiCodes[i].udiCode + "不存在，请重新选择UDI！");
      }
      if (sonUdi[0].parentUdiId != null) {
        throw new Error("关联的子包装UDI码" + sonUdiCodes[i].udiCode + "已被其他父包装UDI码关联，请重新选择UDI！");
      }
      updateList.push({ id: sonUdi[0].id, parentUdiId: parentUdi[0].id });
    }
    let res = ObjectStore.updateBatch("I0P_UDI.I0P_UDI.UDIFilev3", updateList, "821f4590");
    return { result: res };
  }
}
exports({ entryPoint: MyAPIHandler });