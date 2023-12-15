let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var id = request.id;
    var code = request.code;
    //校验code是否已经存在
    var isCodeExist = ObjectStore.queryByYonQL('select code, id from GT12951AT32.GT12951AT32.paymentnishch where dr=0 and orderno="' + code + '"');
    if (isCodeExist.length > 0) {
      throw new Error("该单据已经生成付款申请单");
    }
    //获取应付事项详情
    let func1 = extrequire("GT12951AT32.fiaoplist.fioapdetail");
    let fiaopD = func1.execute(id);
    var insertData = fiaopD.responseObj.data;
    insertData.paybillbnishch2List = insertData.oapDetail;
    //查出来付款金额---只考虑子表有一条数据的情况,不做太复杂了
    var orderno = insertData.paybillbnishch2List[0].orderno;
    //设置原单金额
    insertData.sourcebillnum = insertData.oriSum;
    //查询付款申请进行抵消
    var chSum = ObjectStore.queryByYonQL('select oriSum, id,isSync from GT12951AT32.GT12951AT32.prepaymentnishch where dr=0 and  orderno="' + orderno + '"');
    if (chSum.length > 0) {
      for (let j in chSum) {
        if (chSum[j].isSync == "2") {
          throw new Error("当前未同步付款的预付款申请流程");
        }
        insertData.oriSum = insertData.oriSum - chSum[j].oriSum;
      }
    }
    //子表款项类型=应付款
    insertData.paybillbnishch2List[0].quickType_code = "6";
    insertData.paybillbnishch2List[0].oriSum = insertData.oriSum;
    insertData.paybillbnishch2List[0].natSum = insertData.oriSum;
    insertData.paybillbnishch2List[0].product = insertData.paybillbnishch2List[0].material; //子表物料
    //主表金额
    insertData.natSum = insertData.oriSum;
    insertData.balance = insertData.oriSum;
    insertData.sourcebillcode = insertData.code;
    insertData.bustype = "2281177064296712";
    delete insertData.code;
    delete insertData.oapDetail;
    var res = ObjectStore.insert("GT12951AT32.GT12951AT32.paymentnishch2", insertData, "294cbb05");
    return { res };
  }
}
exports({ entryPoint: MyAPIHandler });