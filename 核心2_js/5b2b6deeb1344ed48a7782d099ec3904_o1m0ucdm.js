let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //撤回回滚合同金额
    var idValue = param.data[0].id;
    var billno = param.data[0].billno;
    var shenqingjine = param.data[0].shenqingjine;
    var sql = "select id,shengyujine,zaitujine  from  GT879AT352.GT879AT352.htxqc where billno = '" + billno + "'";
    var htxqc = ObjectStore.queryByYonQL(sql);
    if (shenqingjine) {
      let beforeSYValue = new Big(htxqc[0].shengyujine);
      let beforeZTValue = new Big(htxqc[0].zaitujine);
      //剩余金额减去申请金额
      let afterSYValue = beforeSYValue.plus(shenqingjine);
      //在途金额加上申请金额
      let afterZTValue = beforeZTValue.minus(shenqingjine);
      var object = { id: htxqc[0].id, shengyujine: afterSYValue, zaitujine: afterZTValue, isWfControlled: "1" };
      var res = ObjectStore.updateById("GT879AT352.GT879AT352.htxqc", object, "7b78e263");
      var fksq = { id: idValue, shifuyituihui: true, isWfControlled: "1" };
      var fksqres = ObjectStore.updateById("GT879AT352.GT879AT352.fksq", fksq, "9077312a");
    } else {
      throw new Error("金额数据中有值为空");
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });