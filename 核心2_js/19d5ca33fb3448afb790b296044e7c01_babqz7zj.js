let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前租户ID
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var tidsql = " and tenant_id = " + "'" + tid + "'";
    var userids = obj.currentUser.id;
    let checkResultID = request.checkResultID === undefined || request.checkResultID === null ? "" : request.checkResultID; //盘点单主键
    let chuliType = request.chuliType === undefined || request.chuliType === null ? "" : request.chuliType; //盘点处理结果处理
    let HandelTimesel = request.HandelTimesel === undefined || request.HandelTimesel === null ? "" : request.HandelTimesel; //处理时间
    //盘亏盘盈处理
    if (chuliType === "1") {
      let billNum = request.billNum === undefined || request.billNum === null ? "" : request.billNum; //分析表coed
      let remark = request.remark === undefined || request.remark === null ? "" : request.remark; //备注
      var sqlsel = "  select * from IDX_02.IDX_02.dxq_checkresult where id=" + checkResultID + " and dr=0 " + tidsql;
      var resultquery = ObjectStore.queryByYonQL(sqlsel);
      if (resultquery !== null && resultquery.length === 1) {
        let object = {
          checkResultID: checkResultID,
          checkID: resultquery[0].checkID,
          coderfid: resultquery[0].coderfID,
          localtionID: resultquery[0].storkLocationID,
          product_id: resultquery[0].product_id,
          product_sku_id: resultquery[0].product_sku_id,
          remark: remark,
          checkstatus: resultquery[0].checkstatus,
          status: 0,
          creator: userids,
          modifier: userids
        };
        if (object.checkstatus == 0 || object.checkstatus == 2) {
          var ressel = ObjectStore.insert("IDX_02.IDX_02.dxq_checkdiff", object, billNum);
        }
      } else {
        return {
          res: "参数错误"
        };
      }
    }
    //忽略处理
    else if (chuliType === "2" || chuliType === "4") {
    }
    //标签损坏处理
    else if (chuliType === "3") {
      //查询内容
      var object = {
        id: checkResultID
      };
      //实体查询
      var resselr = ObjectStore.selectById("test04.test04.checkResult", object);
      if (resselr !== null) {
        var sqlwarehouseId = "select * from IDX_02.IDX_02.dxq_location where and id=" + resselr.checkLocationID + tidsql + " ";
        var data = ObjectStore.queryByYonQL(sqlwarehouseId);
        var warehouseId = "";
        if (data !== null && data.length > 0) {
          warehouseId = data[0].warehouseID;
        }
        var coderfID = resselr.coderfID;
        var objectupdate = {
          id: coderfID,
          warehouse_id: warehouseId,
          location_id: resselr.checkLocationID,
          modifier: userids
        };
        var resuodate = ObjectStore.updateById("IDX_02.IDX_02.dxq_coderfid", objectupdate, "af2e6364");
      }
    }
    var objectchuli = {
      id: stockId,
      ShenheStatus: 2,
      ShenheUser: userids,
      Shenhetime: Shenhetime
    };
    var resuphulue = ObjectStore.updateById("IDX_02.IDX_02.dxq_checkstock", objectchuli, "31a27d3b");
    return {
      res: "处理成功！"
    };
  }
}
exports({
  entryPoint: MyAPIHandler
});