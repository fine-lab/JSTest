let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var code = request.code;
    //校验code是否已经存在
    var isCodeExist = ObjectStore.queryByYonQL('select code, id from GT10894AT82.GT10894AT82.paymentapply0526 where dr=0 and sourcebillcode="' + code + '"');
    if (isCodeExist.length > 0) {
      throw new Error("该单据已经生成付款申请单");
    }
    let func1 = extrequire("GT10894AT82.fioap.fiaopdetail");
    let fiaopD = func1.execute(id);
    var insertData = fiaopD.responseObj.data;
    insertData.paybillbapply0526List = insertData.oapDetail;
    //查出来付款金额---只考虑子表有一条数据的情况,不做太复杂了
    var orderno = insertData.paybillbapply0526List[0].orderno;
    //设置原单金额
    insertData.sourcebillnum = insertData.oriSum;
    //查询付款申请进行抵消
    var chSum = ObjectStore.queryByYonQL('select oriSum, id,isSync from GT10894AT82.GT10894AT82.prepayment where dr=0 and  orderno="' + orderno + '"');
    if (chSum.length > 0) {
      for (let j in chSum) {
        if (chSum[j].isSync == "2") {
          throw new Error("当前未同步付款的预付款申请流程");
        }
        insertData.oriSum = insertData.oriSum - chSum[j].oriSum;
      }
    }
    //子表款项类型=应付款
    insertData.paybillbapply0526List[0].quickType_code = "6";
    insertData.paybillbapply0526List[0].oriSum = insertData.oriSum;
    insertData.paybillbapply0526List[0].natSum = insertData.oriSum;
    insertData.paybillbapply0526List[0].product = insertData.paybillbapply0526List[0].material; //子表物料
    //主表金额
    insertData.natSum = insertData.oriSum;
    insertData.balance = insertData.oriSum;
    insertData.sourcebillcode = insertData.code;
    delete insertData.code;
    delete insertData.oapDetail;
    var res = ObjectStore.insert("GT10894AT82.GT10894AT82.paymentapply0526", insertData, "b1c1b909");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });