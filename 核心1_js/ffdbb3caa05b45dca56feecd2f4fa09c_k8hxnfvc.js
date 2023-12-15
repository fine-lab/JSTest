let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var praybillId = request.praybillId;
    //查询内容
    var object = {
      id: praybillId,
      compositions: [
        {
          name: "defines",
          compositions: []
        }
      ]
    };
    //实体查询
    var res = ObjectStore.selectById("AXT000132.AXT000132.purchaseRequest", object, "ycReqManagement");
    let fields = "expenseItemId,materialClassName,mainNum,invPurExchRateType,purchaseUnitCode,reqdate,productName,reqBudgetPrice,";
    fields += "id,mainUnitId,purchaseUnitId,mainUnitName,receivePersonId,unit,";
    fields += "reqBudgetMny,puOrgDocId,productDocId,invPurExchRate,planMoney,praybillId,";
    fields += "erpCpuPsnId,invPriceExchRate,mainUnitCode,puorgname,quantity,receiveOrgId,receiveOrgName,receivePersonName,";
    fields += "receivePersonTel,praybillbFilesId,purchaseUnitName,reqPurUserName,productCode,unitid,";
    fields += "purchaseNum";
    var sql = "select " + fields + " from AXT000132.AXT000132.purchaseReqlistChild  where praybillId='" + praybillId + "' ";
    var prayBillDetails = ObjectStore.queryByYonQL(sql);
    res.prayBillDetails = prayBillDetails;
    return res;
  }
}
exports({ entryPoint: MyAPIHandler });