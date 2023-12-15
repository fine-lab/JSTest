let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前租户ID
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantID;
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
      var resselr = ObjectStore.selectById("IDX_02.IDX_02.dxq_checkstock", object);
      if (resselr !== null) {
        var cCheckCode = "";
        var rescode = includes(resselr.cCheckCode, "-");
        if (rescode) {
          var resq = resselr.cCheckCode.split("-");
          cCheckCode = resq[0] + "-" + parseInt(parseInt(resq[1]) + 1);
        } else {
          cCheckCode = resselr.cCheckCode + "-1";
        }
        let objs = [];
        var stockarea = "select * from IDX_02.IDX_02.dxq_checkstockArea where dxq_checkstock_id='" + stockId + "'";
        var data = ObjectStore.queryByYonQL(stockarea);
        if (data !== null && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            var objitem = {
              locationName: data[i].hasOwnProperty("locationName") === false ? "" : data[i].locationName,
              locationCode: data[i].hasOwnProperty("locationCode") === false ? "" : data[i].locationCode,
              warehouseCode: data[i].hasOwnProperty("warehouseCode") === false ? "" : data[i].warehouseCode,
              warehouseName: data[i].hasOwnProperty("warehouseName") === false ? "" : data[i].warehouseName,
              locationID: data[i].hasOwnProperty("locationID") === false ? "" : data[i].locationID,
              RFIDCode: data[i].hasOwnProperty("RFIDCode") === false ? "" : data[i].RFIDCode
            };
            objs.push(objitem);
          }
          let object = {
            checkNo: resselr.checkNo,
            cCheckCode: cCheckCode,
            warehouseId: resselr.warehouseId,
            warehousename: resselr.warehousename,
            cRemark: resselr.cRemark,
            IsFupan: 2,
            ParentCheckID: stockId,
            ShenheStatus: 0,
            sourceType: resselr.sourceType,
            iStatus: 0,
            userid: userids,
            checkType: 1,
            dxq_checkstockAreaList: objs
          };
          var ressel = ObjectStore.insert("IDX_02.IDX_02.dxq_checkstock", object, billNum);
          var objectchuli = {
            id: stockId,
            ShenheStatus: 2,
            ShenheUser: userids,
            Shenhetime: Shenhetime
          };
          var resuphulue = ObjectStore.updateById("IDX_02.IDX_02.dxq_checkstock", objectchuli, "31a27d3b");
          return { res: "已经生成复盘单，单号为" + cCheckCode + "" };
        } else {
          return { res: "当前盘点单没有要复盘的位置信息，不生成复盘单，请检查当前盘点单！" };
        }
      } else {
        return { res: "没有当前盘点单,请检查数据！" };
      }
    } else {
      return { res: "参数错误" };
    }
  }
}
exports({ entryPoint: MyAPIHandler });