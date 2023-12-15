let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sourceBillNo = request.sourceBillNo;
    let refuseObj = request.refuseObj;
    let refusetype = request.refusetype;
    let error_info = [];
    let errInfo = [];
    if (refusetype == 7) {
      //查询购进退出复核单子表
      let sql = "select * from GT22176AT10.GT22176AT10.SY01_gjtcfh_l where SY01_puroutreviewv2_id=" + sourceBillNo;
      var res = ObjectStore.queryByYonQL(sql);
      let resStr = JSON.stringify(res);
      let purRes = JSON.parse(resStr);
      if (typeof purRes !== "undefined") {
        for (let i = 0; i < purRes.length; i++) {
          let childBillId = purRes[i].id;
          let jsQty = refuseObj[childBillId];
          let rejectionQty = purRes[i].unqualifie_register;
          let refuseQty = purRes[i].unqualifie_qty;
          if (jsQty + rejectionQty > refuseQty) {
            error_info.push("不满足条件:购进退出复查单的验收拒收数量-购进退出复查单的关联拒收数量>拒收单的拒收数量");
          }
        }
      }
    }
    if (error_info.length > 0) {
      for (let j = 0; j < error_info.length; j++) {
        errInfo[j] = error_info[j] + " \n ";
      }
    }
    return { errInfo };
  }
}
exports({ entryPoint: MyAPIHandler });