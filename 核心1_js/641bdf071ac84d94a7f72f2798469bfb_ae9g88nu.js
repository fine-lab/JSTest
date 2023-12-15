let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billMasterId = request.billMasterId; //上游单据子表ID
    let ret = {};
    //查询质量复查子表
    let object = { sourcechild_id: billMasterId };
    let res = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_medrefuse_l", object);
    let refuseQty = 0;
    if (typeof res !== "undefined") {
      for (let i = 0; i < res.length; i++) {
        refuseQty += res[i].refuseQty;
      }
    }
    ret.refuseQty = refuseQty;
    return { ret };
  }
}
exports({ entryPoint: MyAPIHandler });