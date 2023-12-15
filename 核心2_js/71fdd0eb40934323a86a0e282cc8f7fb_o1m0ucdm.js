let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    //脚本幂等性和流程一致，故借助公司的能力
    //审批过后修改 预置金额 已付金额
    var billno = param.variablesMap.billno;
    var shenqingjine = param.variablesMap.shenqingjine;
    if (!shenqingjine) {
      var sql = "select id,billno,shenqingjine from GT879AT352.GT879AT352.fksq where billno = '" + billno + "'";
      var fksq = ObjectStore.queryByYonQL(sql);
      if (fksq) shenqingjine = fksq[0].shenqingjine;
    }
    var sql = "select id,yifukuanjine,zaitujine  from  GT879AT352.GT879AT352.htxqc where billno = '" + billno + "'";
    var htxqc = ObjectStore.queryByYonQL(sql);
    if (shenqingjine) {
      let htyifukuanjine = htxqc[0].yifukuanjine;
      if (!htxqc[0].yifukuanjine) {
        htyifukuanjine = 0;
      }
      //合同在途金额
      let hezaitujine = htxqc[0].zaitujine;
      if (!htxqc[0].zaitujine) {
        hezaitujine = 0;
      }
      let beforeZTValue = new Big(hezaitujine);
      let beforeYFValue = new Big(htyifukuanjine);
      //在途金额减去申请金额
      let afterZTValue = beforeZTValue.minus(shenqingjine);
      //已付金额加上申请金额
      let afterYFValue = beforeYFValue.plus(shenqingjine);
      var object = { id: htxqc[0].id, zaitujine: afterZTValue, yifukuanjine: afterYFValue };
      var res = ObjectStore.updateById("GT879AT352.GT879AT352.htxqc", object, "7b78e263");
    } else {
      throw new Error("afterWorkflow金额数据中有值为空:" + shenqingjine);
    }
    return { testFlowVa: "111111" };
  }
}
exports({ entryPoint: MyTrigger });