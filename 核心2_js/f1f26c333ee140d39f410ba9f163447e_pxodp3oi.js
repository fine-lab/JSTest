let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let pdata = param.data[0];
    let id = pdata.id;
    let CPMXList = pdata.CPMXList;
    if (CPMXList == undefined || CPMXList == null) {
      let billRst = ObjectStore.queryByYonQL("select *,(select * from CPMXList) as CPMXList from GT3734AT5.GT3734AT5.YHLC where id='" + id + "'", "developplatform");
      CPMXList = billRst[0].CPMXList;
    }
    for (var i in CPMXList) {
      let cpmxObj = CPMXList[i];
      let srcBillEntryId = cpmxObj.srcBillEntryId;
      if (srcBillEntryId == null || srcBillEntryId == "") {
        continue;
      }
      let InspectionQuantity = cpmxObj.InspectionQuantity; //验货数量
      let sqlStr = "select * from pu.purchaseorder.PurchaseOrders where id='" + srcBillEntryId + "'";
      let saleres = ObjectStore.queryByYonQL(sqlStr, "upu");
      let qty = saleres[0].qty;
      sqlStr =
        "select sum(InspectionQuantity) as InspectionQuantity from GT3734AT5.GT3734AT5.CPMX inner join GT3734AT5.GT3734AT5.YHLC t on t.id=YHLC_id where srcBillEntryId='" +
        srcBillEntryId +
        "' and t.id!='" +
        id +
        "'";
      let res = ObjectStore.queryByYonQL(sqlStr, "developplatform");
      let sumQty = 0;
      if (res != null && res.length > 0) {
        sumQty = res[0].InspectionQuantity;
      }
      if (InspectionQuantity + sumQty > qty) {
        throw new Error("操作失败:第" + (Number(i) + 1) + "行分录验货总数量[" + (InspectionQuantity + sumQty) + "]不能大于采购数量[" + qty + "],请确认是否已下推过验货单!");
      }
    }
    return { rst: true };
  }
}
exports({ entryPoint: MyTrigger });