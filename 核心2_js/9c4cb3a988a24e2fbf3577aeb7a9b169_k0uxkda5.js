let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let requestData = param.requestData;
    if (requestData instanceof Object) {
      requestData = JSON.stringify(requestData);
    }
    requestData = requestData.replace(/:s*([0-9]{15,})s*(,?)/g, ': "$1" $2');
    requestData = JSON.parse(requestData);
    if (requestData.salesOrgId == "1556733659914960925" || requestData.salesOrgId == "1556733659914960919") {
      let ids = new Array();
      let orderDetails = requestData.orderDetails;
      if (orderDetails.length > 0) {
        for (let i = 0; i < orderDetails.length; i++) {
          ids.push(orderDetails[i].productId);
        }
      }
      let body = {
        data: {
          id: ids
        }
      };
      let stockArray = new Array();
      let stockOrgId = ""; //库存组织
      let stockOrgId_name = ""; //库存组织名称
      let stockId = ""; //仓库
      let stockName = ""; //仓库名称
      let wlDetailUrl = "https://www.example.com/";
      let apiResponse = openLinker("POST", wlDetailUrl, "SCMSA", JSON.stringify(body));
      apiResponse = JSON.parse(apiResponse);
      if (apiResponse.code == "200") {
        let recordList = apiResponse.data.recordList;
        //循环处理单位
        for (var i = 0; i < recordList.length; i++) {
          for (let j = 0; j < orderDetails.length; j++) {
            let stock = {
              detailId: "",
              stockOrgId: "",
              stockOrgId_name: "",
              stockId: "",
              stockName: ""
            };
            if (recordList[i].pc_productlist_userDefine_1668215377238687749 != "XZL" && recordList[i].id == orderDetails[j].productId) {
              let freeDefine = recordList[i].freeDefine;
              if (typeof freeDefine != "undefined") {
                stock.detailId = orderDetails[j].idKey;
                stock.stockOrgId = freeDefine.define1;
                stock.stockOrgId_name = freeDefine.define1_name;
                stockArray.push(stock);
              } else {
                throw new Error("请检查物料" + orderDetails[j].productName + "是否维护库存组织");
              }
            }
          }
        }
        let stockUrl = "https://www.example.com/";
        let orgList = new Array();
        if (stockArray.length > 0) {
          for (var k = 0; k < stockArray.length; k++) {
            orgList.push(stockArray[k].stockOrgId);
          }
          let stockBody = {
            pageSize: 50,
            pageIndex: 1,
            iUsed: "enable",
            org: orgList
          };
          let apiStockResponse = openLinker("POST", stockUrl, "SCMSA", JSON.stringify(stockBody));
          apiStockResponse = JSON.parse(apiStockResponse);
          if (apiStockResponse.code == "200") {
            let stockList = apiStockResponse.data.recordList;
            if (stockList.length > 0) {
              for (var k = 0; k < stockList.length; k++) {
                let stock = stockList[k];
                for (var n = 0; n < stockArray.length; n++) {
                  if (stock.org == stockArray[n].stockOrgId && includes(stock.code, "M")) {
                    stockArray[n].stockId = stock.id;
                    stockArray[n].stockName = stock.name;
                  }
                }
              }
            } else {
              throw new Error("当前库存组织：" + stockOrgId_name + "未找到门店仓");
            }
          } else {
            throw new Error("查询仓库异常");
          }
        }
      } else {
        throw new Error("查询物料库存组织异常");
      }
      let dataOrderDetails = param.data[0].orderDetails;
      for (var j = 0; j < dataOrderDetails.length; j++) {
        for (var m = 0; m < stockArray.length; m++) {
          if (dataOrderDetails[j].idKey == stockArray[m].detailId) {
            if (stockArray[m].stockId == "") {
              throw new Error("库存组织：" + stockArray[m].stockOrgId_name + "未维护对应的门店仓");
            } else {
              param.data[0].orderDetails[j].set("stockOrgId", stockArray[m].stockOrgId);
              param.data[0].orderDetails[j].set("stockOrgId_name", stockArray[m].stockOrgId_name);
              param.data[0].orderDetails[j].set("stockId", stockArray[m].stockId);
              param.data[0].orderDetails[j].set("stockName", stockArray[m].stockName);
            }
          }
        }
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });