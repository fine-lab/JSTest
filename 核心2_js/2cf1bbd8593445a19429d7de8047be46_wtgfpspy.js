let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //拿到数据
    var data = param.data[0];
    var { id, YJ_CarBoxStand, YJ_HeavyStand, NonstandRemark } = data;
    var flag = false;
    if (YJ_CarBoxStand > 500) {
      flag = true;
    } else if (YJ_HeavyStand > 600) {
      flag = true;
    } else if (NonstandRemark !== undefined && NonstandRemark !== null) {
      flag = true;
    }
    var IsStandard = flag ? "非标" : "标准";
    var verifystate = flag ? "0" : "2"; //单据状态
    var object = { id: id, IsStandard: IsStandard, verifystate: verifystate, YJ_NonstandPrice: "0" };
    var res1 = ObjectStore.updateById("GT9604AT11.GT9604AT11.QuoteBill_M", object);
    //如果是非标，增加一行非标物料明细
    if (flag) {
      var object_FB = { MaterialCode: "/", MaterialName: "/", Specification: "/", Unit: "/", FBCount: "0", FBRemark: "/", QuoteBill_FBWLFk: id };
      var res2 = ObjectStore.insert("GT9604AT11.GT9604AT11.QuoteBill_FBWL", object_FB, "QuoteBill_FBWL");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });