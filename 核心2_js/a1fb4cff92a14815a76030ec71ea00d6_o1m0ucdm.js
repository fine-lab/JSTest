let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    var variablesMap = JSON.parse(param.requestData);
    var idValue = variablesMap.id;
    //目前暂时的方式   ObjectStore.updateById  传的参数里  先加上isWfControlled:'1'
    var isWf = { id: idValue, isWfControlled: "1" };
    var fksqisWf = ObjectStore.updateById("GT879AT352.GT879AT352.fksq", isWf, "9077312a");
    //是已经撤销的情况下 完全退回的情况
    if (variablesMap.shifuyituihui) {
      var billno = variablesMap.billno;
      var shenqingjine = variablesMap.shenqingjine;
      var sql = "select id,shengyujine,zaitujine,hetonjine  from  GT879AT352.GT879AT352.htxqc where billno = '" + billno + "'";
      var htxqc = ObjectStore.queryByYonQL(sql);
      //更新合同的在途金额和剩余金额
      if (shenqingjine) {
        //合同剩余金额
        let htshengyujine = htxqc[0].shengyujine;
        //合同在途金额
        let hezaitujine = htxqc[0].zaitujine;
        if (!htxqc[0].shengyujine) {
          htshengyujine = htxqc[0].hetonjine; //如果合同剩余金额为空，等于合同金额
        }
        if (!htxqc[0].zaitujine) {
          hezaitujine = 0;
        }
        let beforeSYValue = new Big(htshengyujine);
        let beforeZTValue = new Big(hezaitujine);
        //剩余金额减去申请金额
        let afterSYValue = beforeSYValue.minus(shenqingjine);
        //在途金额加上申请金额
        let afterZTValue = beforeZTValue.plus(shenqingjine);
        var object = { id: htxqc[0].id, shengyujine: afterSYValue, zaitujine: afterZTValue, isWfControlled: "1" };
        var res = ObjectStore.updateById("GT879AT352.GT879AT352.htxqc", object, "7b78e263");
        var fksq = { id: idValue, shifuyituihui: false, isWfControlled: "1" };
        var fksqres = ObjectStore.updateById("GT879AT352.GT879AT352.fksq", fksq, "9077312a");
      } else {
        throw new Error("beforeWorkflow金额数据中有值为空:" + variablesMap.shenqingjine);
      }
    }
    return { testFlowVa: "111111" };
  }
}
exports({ entryPoint: MyTrigger });