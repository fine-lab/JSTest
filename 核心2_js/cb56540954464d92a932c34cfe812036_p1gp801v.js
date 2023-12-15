let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前租户ID
    var res = AppContext();
    var obj = JSON.parse(res);
    var userids = obj.currentUser.id;
    let billNum = request.billNum === undefined || request.billNum === null ? "" : request.billNum; //当前前端框架的编码
    let stockId = request.stockId === undefined || request.stockId === null ? "" : request.stockId; //获取当前需要复审的盘点单主键
    let Shenhetime = request.Shenhetime === undefined || request.Shenhetime === null ? "" : request.Shenhetime; //审核时间
    if (billNum !== null && billNum !== "") {
      //查询内容
      var object = {
        id: stockId
      };
      //实体查询
      var resselr = ObjectStore.selectById("Idx3.Idx3.dxq_checkstock", object);
      if (resselr !== null) {
        var cCheckCode = "";
        var rescode = includes(resselr.cCheckCode, "-");
        if (rescode) {
          var resq = resselr.cCheckCode.split("-");
          cCheckCode = resq[0] + "-" + parseInt(parseInt(resq[1]) + 1);
        } else {
          cCheckCode = resselr.cCheckCode + "-1";
        }
        let object = {
          checkNo: resselr.hasOwnProperty("checkNo") === false ? "" : resselr.checkNo,
          cCheckCode: cCheckCode,
          warehouseId: resselr.hasOwnProperty("warehouseId") === false ? "" : resselr.warehouseId,
          warehousename: resselr.hasOwnProperty("warehousename") === false ? "" : resselr.warehousename,
          cRemark: resselr.hasOwnProperty("cRemark") === false ? "" : resselr.cRemark,
          IsFupan: 2,
          ParentCheckID: resselr.hasOwnProperty("stockId") === false ? "" : resselr.stockId,
          ShenheStatus: 0,
          sourceType: resselr.hasOwnProperty("sourceType") === false ? "" : resselr.sourceType,
          iStatus: 0,
          userid: userids,
          checkType: 1,
          org_id: resselr.hasOwnProperty("org_id") === false ? "" : resselr.org_id
        };
        var ressel = ObjectStore.insert("Idx3.Idx3.dxq_checkstock", object, billNum);
        var objectchuli = {
          id: stockId,
          ShenheStatus: 2,
          ShenheUser: userids,
          Shenhetime: Shenhetime
        };
        var resuphulue = ObjectStore.updateById("Idx3.Idx3.dxq_checkstock", objectchuli, "");
        return {
          res: "已经生成复盘单，单号为" + cCheckCode + ""
        };
      } else {
        return {
          res: "没有当前盘点单,请检查数据！"
        };
      }
    } else {
      return {
        res: "参数错误"
      };
    }
  }
}
exports({
  entryPoint: MyAPIHandler
});