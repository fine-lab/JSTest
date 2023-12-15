let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var AppCode = "ST";
    //产品入库单列表查询  根据来源订单
    var getStoreprorecordListUrl = "https://www.example.com/";
    var getStoreprorecordListBody = {
      pageIndex: 1,
      pageSize: 500,
      simpleVOs: [
        {
          field: "storeProRecords.mocode", //来源生产订单号
          op: "eq",
          value1: request.mocode
        }
      ]
    };
    var getStoreprorecordListApiResponse = JSON.parse(openLinker("POST", getStoreprorecordListUrl, AppCode, JSON.stringify(getStoreprorecordListBody)));
    //汇总长度;
    var summaryQty = 0;
    if (getStoreprorecordListApiResponse.code == "200") {
      var getStoreprorecordList = getStoreprorecordListApiResponse.data.recordList;
      for (var i = 0; i < getStoreprorecordListApiResponse.data.recordCount; i++) {
        if (getStoreprorecordList[i].memo == "生产入库") {
          summaryQty = summaryQty + getStoreprorecordList[i].qty;
        }
      }
    }
    var getMaterialoutListUrl = "https://www.example.com/";
    var getMaterialoutListBody = {
      pageIndex: 1,
      pageSize: 500,
      simpleVOs: [
        {
          field: "materOuts.firstupcode", //来源生产订单号
          op: "eq",
          value1: request.mocode
        }
      ]
    };
    var getMaterialoutListApiResponse = JSON.parse(openLinker("POST", getMaterialoutListUrl, AppCode, JSON.stringify(getMaterialoutListBody)));
    var a = {};
    if (getMaterialoutListApiResponse.code == "200") {
      var getMaterialoutList = getMaterialoutListApiResponse.data.recordList;
      for (var j = 0; j < getMaterialoutListApiResponse.data.recordCount; j++) {
        if (a[getMaterialoutList[j].product_cCode] == null) {
          a[getMaterialoutList[j].product_cCode] = getMaterialoutList[j].qty;
        } else {
          a[getMaterialoutList[j].product_cCode] = a[getMaterialoutList[j].product_cCode] + getMaterialoutList[j].qty;
        }
      }
    }
    var productionorderListUrl = "https://www.example.com/";
    var productionorderListBody = {
      pageIndex: 1,
      pageSize: 10,
      code: request.mocode,
      isShowProcess: 0,
      isShowMaterial: false
    };
    var productionorderListApiResponse = JSON.parse(openLinker("POST", productionorderListUrl, AppCode, JSON.stringify(productionorderListBody)));
    var productionorderId = 0;
    var productionorderCreateApiResponse;
    if (productionorderListApiResponse.code == "200") {
      //生产订单id
      productionorderId = productionorderListApiResponse.data.recordList[0].id;
      var productionorderBatchunaudit = "https://www.example.com/";
      var productionorderBatchunauditBody = {
        data: [
          {
            id: productionorderId
          }
        ]
      };
      var productionorderBatchunauditApiResponse = JSON.parse(openLinker("POST", productionorderBatchunaudit, AppCode, JSON.stringify(productionorderBatchunauditBody)));
      var productionorderDetailUrl = "https://www.example.com/" + "?id=" + productionorderId;
      var productionorderDetailApiResponse = JSON.parse(openLinker("GET", productionorderDetailUrl, AppCode, null));
      if (productionorderDetailApiResponse.code == "200") {
        var info_by_idUrl = "https://www.example.com/" + "?orgId=" + productionorderDetailApiResponse.data.orgId;
        var info_by_idApiResponse = JSON.parse(openLinker("GET", info_by_idUrl, AppCode, null));
        if (info_by_idApiResponse.code == "200") {
          var productionorderDetailData = productionorderDetailApiResponse.data;
          productionorderDetailData["resubmitCheckKey"] = Date.parse(new Date());
          productionorderDetailData["_status"] = "Update";
          productionorderDetailData["orgCode"] = info_by_idApiResponse.data.code;
          productionorderDetailData.orderProduct[0]["incomingQuantity"] = summaryQty;
          productionorderDetailData.orderProduct[0]["incomingAuxiliaryQuantity"] = summaryQty;
          productionorderDetailData.orderProduct[0]["_status"] = "Update";
          for (var m = 0; m < productionorderDetailData.orderProduct[0].orderMaterial.length; m++) {
            productionorderDetailData.orderProduct[0].orderMaterial[m]["_status"] = "Update";
            productionorderDetailData.orderProduct[0].orderMaterial[m].receivedQuantity =
              Math.round(summaryQty * productionorderDetailData.orderProduct[0].orderMaterial[m].bomUnitUseQuantity * 100000000) / 100000000;
            productionorderDetailData.orderProduct[0].orderMaterial[m].mainNumeratorQuantity = Math.round(productionorderDetailData.orderProduct[0].orderMaterial[m].mainNumeratorQuantity * 100) / 100;
            productionorderDetailData.orderProduct[0].orderMaterial[m].numeratorQuantity = Math.round(productionorderDetailData.orderProduct[0].orderMaterial[m].numeratorQuantity * 100) / 100;
          }
          var productionorderCreateUrl = "https://www.example.com/";
          var productionorderCreateBody = {
            data: productionorderDetailData
          };
          productionorderCreateApiResponse = JSON.parse(openLinker("POST", productionorderCreateUrl, AppCode, JSON.stringify(productionorderCreateBody)));
          var productionorderAudit = "https://www.example.com/";
          var productionorderAuditBody = {
            data: {
              id: productionorderId
            }
          };
          var productionorderBatchunauditApiResponse = JSON.parse(openLinker("POST", productionorderAudit, AppCode, JSON.stringify(productionorderAuditBody)));
        }
      }
    }
    return { productionorderCreateApiResponse };
  }
}
exports({ entryPoint: MyAPIHandler });