let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(billnum) {
    //获取单据编码
    var sql = "select id,billnum,formula,main,billsaveparams,enable from GT16037AT2.GT16037AT2.billbuzconfigure where billnum='" + billnum + "'";
    var res = ObjectStore.queryByYonQL(sql);
    //主表信息
    var mainR = [];
    //子表信息
    var chR = [];
    //单据存储审批人字段
    var billSaveParams = "";
    //是否勾选上级领导人
    var formula = "0";
    if (res != null && res.length > 0) {
      //判断是否启用
      if (res[0].enable != 0) {
        billSaveParams = res[0].billsaveparams;
        var id = res[0].id;
        formula = res[0].formula;
        //获取主流程人员信息
        var sql2 = "select main from GT16037AT2.GT16037AT2.billbuzconfigure_main where fkid='" + id + "'";
        var res2 = ObjectStore.queryByYonQL(sql2);
        for (let i in res2) {
          mainR.push(res2[i].main);
        }
        //获取子表信息
        var sql3 = "select person,cparams,options,vs from 	GT16037AT2.GT16037AT2.approveperson where approvepersonFk='" + id + "'";
        chR = ObjectStore.queryByYonQL(sql3);
      }
    }
    return { mainR: mainR, chR: chR, formula: formula, billSaveParams: billSaveParams };
  }
}
exports({ entryPoint: MyAPIHandler });