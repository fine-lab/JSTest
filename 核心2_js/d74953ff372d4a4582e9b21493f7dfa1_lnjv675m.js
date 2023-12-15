let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let HyFund_cutFk = request.HyFund_cutFk;
    //主表uri
    let table = "GT35175AT8.GT35175AT8.HyFund_MTB";
    let conditions = { fund_cut_id: HyFund_cutFk };
    let object = ObjectStore.selectByMap(table, conditions);
    let obj = object[0];
    let func1 = extrequire("GT35175AT8.dataQuery.copyBycode");
    let res1 = func1.execute({ code: obj.up_fund_code });
    let copyID = res1.res[0].id;
    obj.adjust_state = "1";
    obj.HyFundTree = copyID;
    let res = ObjectStore.updateById(table, obj);
    return { res: res, res1: res1 };
  }
}
exports({ entryPoint: MyAPIHandler });