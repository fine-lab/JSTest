let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let sourceBillNo = request.sourceBillNo;
    let refuseObj = request.refuseObj;
    let refusetype = request.refusetype;
    let error_info = [];
    let errInfo = [];
    if (refusetype == 1) {
      //查询购进入库验收单子表
      let object = { SY01_purinstockysv2_id: sourceBillNo };
      let res = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_purinstockys_l", object);
      let resStr = JSON.stringify(res);
      let purRes = JSON.parse(resStr);
      if (typeof purRes !== "undefined") {
        for (let i = 0; i < purRes.length; i++) {
          let childBillId = purRes[i].id;
          let jsQty = refuseObj[childBillId];
          let rejectionQty = purRes[i].rejection_qty;
          let refuseQty = purRes[i].refuse_qty;
          if (jsQty + rejectionQty > refuseQty) {
            error_info.push("不满足条件:购进入库验收单的验收拒收数量-购进入库验收单的关联拒收数量>质量复查单的拒收数量");
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