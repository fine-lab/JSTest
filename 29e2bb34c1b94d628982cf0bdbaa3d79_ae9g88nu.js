let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let billMasterId = request.billMasterId; //上游单据子表ID
    let ret = {};
    //查询购进入库验收单子表
    let object = { sourcechild_id: billMasterId };
    let res = ObjectStore.selectByMap("GT22176AT10.GT22176AT10.SY01_purinstockys_l", object);
    let checkQty = 0;
    if (typeof res !== "undefined") {
      for (let i = 0; i < res.length; i++) {
        checkQty += res[i].checkQty;
      }
    }
    ret.checkQty = checkQty;
    return { ret };
  }
}
exports({ entryPoint: MyAPIHandler });