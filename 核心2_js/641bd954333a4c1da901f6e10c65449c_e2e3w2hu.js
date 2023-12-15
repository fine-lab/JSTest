let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var AppCode = "ST";
    //材料出库列表查询Url
    var materialoutListUrl = "https://www.example.com/";
    //材料出库单保存Url
    var materialoutSaveUrl = "https://www.example.com/";
    //材料出库单删除Url
    var materialoutBatchdeleteUrl = "https://www.example.com/";
    var materialoutListBody = {
      pageIndex: 1,
      pageSize: 10,
      simpleVOs: [
        {
          field: "materOuts.sourceid",
          op: "eq",
          value1: request.id
        }
      ]
    };
    //材料出库列表查询
    var materialoutListApiResponse = JSON.parse(openLinker("POST", materialoutListUrl, AppCode, JSON.stringify(materialoutListBody)));
    //材料出库列表查询结果
    var materialoutListApiResponse = JSON.parse(openLinker("POST", materialoutListUrl, AppCode, JSON.stringify(materialoutListBody)));
    //材料出库列表查询详情
    var materialoutListRecordList = new Array();
    if (materialoutListApiResponse.data.recordCount > 0) {
      materialoutListRecordList = materialoutListApiResponse.data.recordList;
    }
    var materialoutSaveBody = {
      org: materialoutListRecordList[0].org,
      vouchdate: materialoutListRecordList[0].vouchdate,
      factoryOrg: materialoutListRecordList[0].factoryOrg,
      warehouse: materialoutListRecordList[0].warehouse,
      bustype: "2322624486642944",
      id: materialoutListRecordList[0].id,
      pubts: materialoutListRecordList[0].pubts,
      department: materialoutListRecordList[0].department,
      _status: "Update",
      materOuts: ""
    };
    //材料出库子表
    var materOutsList = new Array();
    //材料出库子表详情
    var materOuts;
    for (var i = 0; materialoutListRecordList.length > i; i++) {
      materOuts = {
        product: materialoutListRecordList[i].product,
        unit: materialoutListRecordList[i].unit,
        stockUnitId: materialoutListRecordList[i].stockUnitId,
        invExchRate: materialoutListRecordList[i].invExchRate,
        subQty: materialoutListRecordList[i].qty,
        id: materialoutListRecordList[i].materOuts.id,
        pubts: materialoutListRecordList[i].pubts,
        _status: "Update"
      };
      materOutsList.push(materOuts);
    }
    materialoutSaveBody.materOuts = materOutsList;
    //材料出库保存结果
    var saveBody = {
      data: materialoutSaveBody
    };
    //材料出库保存结果
    var materialoutSaveApiResponse = JSON.parse(openLinker("POST", materialoutSaveUrl, AppCode, JSON.stringify(saveBody)));
    var materialoutBatchdeleteBody = {
      data: [
        {
          id: materialoutListRecordList[0].id
        }
      ]
    };
    var materialoutBatchdeleteApiResponse = JSON.parse(openLinker("POST", materialoutBatchdeleteUrl, AppCode, JSON.stringify(materialoutBatchdeleteBody)));
    return {};
  }
}
exports({ entryPoint: MyAPIHandler });