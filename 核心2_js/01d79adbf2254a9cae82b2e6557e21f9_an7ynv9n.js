let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let productClassSql =
      "select srcbillid,srcbillno,srcbillitemid,topsrcbillitemid,topsrcbillno,mainid.createTime,mainid.modifyTime,mainid.paytime,mainid.settledate,mainid.auditTime,mainid.pubts from arap.receivebill.ReceiveBill_b where mainid.code = 'YS-231115-2590000001'  "; //"select srcbillid,srcbillno,topsrcbillitemid,topsrcbillno,topsrcbillitemno from arap.receivebill.ReceiveBill_b where dr=0";//topsrcbillno = '1302230823UDH0004' srcbillno = '1302231117UDH0020'
    let productClassInfo = ObjectStore.queryByYonQL(productClassSql, "fiarap");
    throw new Error(JSON.stringify(productClassInfo));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });