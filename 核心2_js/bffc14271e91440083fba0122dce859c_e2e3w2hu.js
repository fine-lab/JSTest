let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    //产品入库保存url
    var AppCode = "ST";
    var storeprorecordSaveUrl = "https://www.example.com/";
    var storeProRecords = new Array();
    for (var i = 0; request.param.storeProRecords.length > i; i++) {
      var storeProRecordBody = {
        _status: "Insert",
        stockUnitId: request.param.storeProRecords[i].stockUnitId,
        mocode: request.param.storeProRecords[i].mocode,
        upcode: request.param.storeProRecords[i].upcode,
        unit: request.param.storeProRecords[i].unit,
        product: request.param.storeProRecords[i].product, //物料id
        productsku_cCode: request.param.storeProRecords[i].productsku_cCode, //物料sku编码
        "defines!define1": request.param.storeProRecords[i]["defines!define1"],
        qty: request.param.storeProRecords[i].qty,
        invExchRate: request.param.storeProRecords[i].invExchRate,
        source: request.param.storeProRecords[i].source,
        moid: request.param.storeProRecords[i].moid,
        mosource: request.param.storeProRecords[i].mosource,
        sourceautoid: request.param.storeProRecords[i].sourceautoid,
        sourceid: request.param.srcBill,
        moautoid: request.param.storeProRecords[i].moautoid
      };
      storeProRecords.push(storeProRecordBody);
    }
    var storeprorecordSaveBody = {
      data: {
        resubmitCheckKey: substring(replace(uuid(), "-", ""), 0, 20),
        org: request.param.org,
        department: request.param.department,
        vouchdate: request.param.vouchdate,
        warehouse: request.param.warehouse,
        factoryOrg: request.param.factoryOrg,
        bustype: request.param.bustype,
        _status: "Insert",
        srcBill: request.param.srcBill,
        srcBillNO: request.param.srcBillNO,
        totalQuantity: request.param.totalQuantity,
        memo: request.param.memo,
        storeProRecords: storeProRecords,
        "headItem!define4": request.param["headItem!define4"],
        "headItem!define5": request.param["headItem!define5"]
      }
    };
    var storeprorecordSave = openLinker("POST", storeprorecordSaveUrl, AppCode, JSON.stringify(storeprorecordSaveBody));
    return { storeprorecordSave };
  }
}
exports({ entryPoint: MyAPIHandler });