let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //获取当前租户ID
    var res = AppContext();
    var obj = JSON.parse(res);
    var tid = obj.currentUser.tenantId;
    var userids = obj.currentUser.id;
    let billNum = request.billNum === undefined || request.billNum === null ? "" : request.billNum; //备注
    if (billNum !== null && billNum !== "") {
      let cRemark = request.cRemark === undefined || request.cRemark === null ? "" : request.cRemark; //备注
      let org_id = request.org_id === undefined || request.org_id === null ? "" : request.org_id; //org_id组织id
      let Codesuiji = request.Codesuiji === undefined || request.Codesuiji === null ? "" : request.Codesuiji; //备注
      let warehouseName = request.warehouseName === undefined || request.warehouseName === null ? "" : request.warehouseName; //仓库名称
      let warehouseId = request.warehouseId === undefined || request.warehouseId === null ? "" : request.warehouseId; //仓库id
      let statusType = 0; //盘点状态 未开始
      var res4 = S4();
      Codesuiji = Codesuiji + res4;
      //生成盘点编码
      let pandiancode = "C" + Codesuiji;
      var sonDataArr = [];
      var sonData = {};
      sonData.iStatus = 0;
      sonData.locationCode = warehouseCode;
      sonData.locationID = warehouseId;
      sonData.locationName = warehouseName;
      sonData.warehouseName = warehouseName;
      sonData.creator = userids;
      sonData.createTime = timestr;
      sonDataArr.push(sonData);
      let object = {
        checkNo: Codesuiji,
        cCheckCode: pandiancode,
        warehouseId: warehouseId,
        warehousename: warehouseName,
        cRemark: cRemark,
        IsFupan: 1,
        ShenheStatus: 0,
        iStatus: 0,
        userid: userids,
        checkType: 1,
        org_id: org_id,
        dxq_checkstockAreaList: sonDataArr
      };
      var ressel = ObjectStore.insert("Idx3.Idx3.dxq_checkstock", object, billNum); // 盘点单主单插入
      return {
        res: ressel
      };
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