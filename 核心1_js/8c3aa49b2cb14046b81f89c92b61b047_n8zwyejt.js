let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let danjuleixing = request.danjuleixing;
    let danjubianhao = request.danjubianhao;
    let wuliaomingchen = request.wuliaomingchen;
    let djType = "";
    let djbh = "";
    let wlmc = "";
    if (typeof danjuleixing !== undefined && danjuleixing !== "" && danjuleixing != null) {
      djType = "and billName = '" + danjuleixing + "' ";
    }
    if (typeof danjubianhao !== undefined && danjubianhao !== "" && danjubianhao != null) {
      djbh = "and billNo = '" + danjubianhao + "' ";
    }
    let whereInfo = djType + djbh;
    let resDataList = "select *,material.name materialName from I0P_UDI.I0P_UDI.UDITrackv3 where trackingDirection = '生成' " + whereInfo + " GROUP BY billNo";
    let resDataRs1 = ObjectStore.queryByYonQL(resDataList);
    let resDataRs = [];
    if (resDataRs1.length === 0 || typeof resDataRs1 == "undefined") {
      return { resDataRs };
    }
    if (typeof wuliaomingchen !== undefined && wuliaomingchen !== "" && wuliaomingchen != null) {
      //筛选名称
      for (let i = 0; i < resDataRs1.length; i++) {
        if (resDataRs1[i].materialName.indexOf(wuliaomingchen) !== -1) {
          resDataRs.push(resDataRs1[i]);
        }
      }
    } else {
      resDataRs = resDataRs1;
    }
    return { resDataRs };
  }
}
exports({ entryPoint: MyAPIHandler });