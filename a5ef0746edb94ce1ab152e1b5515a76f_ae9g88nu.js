let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billMasterId = request.billMasterId; //上游单据子表ID
    let ret = {};
    //查询质量复查主表
    let object = { sourcechild_id: billMasterId };
    let res = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_quareventryv1", object);
    let fchgsl = 0;
    let fcbhgsl = 0;
    if (typeof res !== "undefined") {
      for (let i = 0; i < res.length; i++) {
        fchgsl += parseFloat(res[i].fchgsl);
        fcbhgsl += parseFloat(res[i].fcbhgsl);
      }
    }
    ret.fchgsl = parseFloat(fchgsl);
    ret.fcbhgsl = parseFloat(fcbhgsl);
    return { ret };
  }
}
exports({ entryPoint: MyAPIHandler });