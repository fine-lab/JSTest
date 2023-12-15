let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    var itemList = request.itemList;
    var summary = 0;
    for (var prop in itemList) {
      var rangeUrl = "https://www.example.com/" + request.access_token;
      var rangeParam = {
        enable: "1",
        pageIndex: 1,
        pageSize: 10,
        code: itemList[prop]["pdGiftInvCode"]
      };
      var strResponse = postman("post", rangeUrl, null, JSON.stringify(rangeParam));
      var responseObj = JSON.parse(strResponse);
      if ("200" !== responseObj.code) {
        throw new Error(responseObj.message);
      }
      var rangeId = responseObj.data.recordList[0].productApplyRangeId;
      var url = "https://www.example.com/" + request.access_token + "&id=" + itemList[prop]["pdGiftInv"] + "&productApplyRangeId=" + rangeId;
      strResponse = postman("get", url, null, null);
      responseObj = JSON.parse(strResponse);
      //成箱单位，销售单位
      var productAssistUnitExchanges = responseObj.data.productAssistUnitExchanges;
      var saleUnit = responseObj.data.detail.batchUnit_Name;
      var boxUnit = responseObj.data.detail.produceUnit_Name;
      var saleUnitCount, saleUnitName, saleUnitId;
      var boxUnitCount, boxUnitName, boxUnitId;
      for (var ii in productAssistUnitExchanges) {
        if (productAssistUnitExchanges[ii].assistUnit_Name == saleUnit) {
          saleUnitCount = productAssistUnitExchanges[ii].mainUnitCount;
          saleUnitName = productAssistUnitExchanges[ii].assistUnit_Name;
          saleUnitId = productAssistUnitExchanges[ii].assistUnit;
        }
        //成箱条件单位
        if (productAssistUnitExchanges[ii].assistUnit_Name == boxUnit) {
          boxUnitCount = productAssistUnitExchanges[ii].mainUnitCount;
          boxUnitName = productAssistUnitExchanges[ii].assistUnit_Name;
          boxUnitId = productAssistUnitExchanges[ii].assistUnit;
        }
      }
      if (saleUnitCount == undefined) {
        saleUnitCount = 1;
        saleUnitName = responseObj.data.unit_Name;
        saleUnitId = responseObj.data.unit;
      }
      if (boxUnitCount == undefined) {
        boxUnitCount = 1;
        boxUnitName = responseObj.data.unit_Name;
        boxUnitId = responseObj.data.unit;
      }
      itemList[prop]["fdSaleUnitCount"] = saleUnitCount;
      itemList[prop]["fdSaleUnitName"] = saleUnitName;
      itemList[prop]["fdSaleUnitId"] = saleUnitId;
      itemList[prop]["fdBoxUnitCount"] = boxUnitCount;
      itemList[prop]["fdBoxUnitName"] = boxUnitName;
      itemList[prop]["fdBoxUnitId"] = boxUnitId;
      var outTaxRateName = responseObj.data.detail.outTaxrate_Name;
      var outTaxRateId = responseObj.data.detail.outTaxrate;
      itemList[prop]["fdTaxRate"] = outTaxRateId;
      itemList[prop]["fdTaxRate_ntaxRate"] = outTaxRateName;
      itemList[prop]["fdWarehouse"] = responseObj.data.detail.deliveryWarehouse;
      itemList[prop]["fdWarehouse_name"] = responseObj.data.detail.deliveryWarehouse_Name;
      //计算成箱数量
      //数量必须大于0
      if (itemList[prop]["pdGiftQuantity"] <= 0) {
        continue;
      }
      itemList[prop]["fdQuantity"] = itemList[prop]["pdGiftQuantity"];
      itemList[prop]["fdMainQty"] = itemList[prop]["pdGiftQuantity"] * itemList[prop]["fdSaleUnitCount"];
      itemList[prop]["fdSaleQuantity"] = itemList[prop]["fdMainQty"] / itemList[prop]["fdBoxUnitCount"];
      //查询单价
      var curDate = request.curDate;
      var params = {
        conditions: [
          { name: "conditionDate", conditionType: "between", isDefine: false, isOuterField: false, valueType: "LOCALDATETIME", v1: curDate, v2: curDate },
          {
            v2: "",
            conditionType: "eq",
            v1: itemList[prop]["pdGiftInv"],
            valueType: "long",
            name: "productId"
          },
          {
            v2: "",
            conditionType: "eq",
            v1: request.customer,
            valueType: "long",
            name: "agentId"
          }
        ],
        page: {
          pageSize: 1000,
          pageIndex: 1
        }
      };
      var urlPrice = "https://www.example.com/" + request.access_token;
      strResponse = postman("post", urlPrice, null, JSON.stringify(params));
      responseObj = JSON.parse(strResponse);
      if ("200" == responseObj.code) {
        //请求成功
        var data = responseObj.data.content;
        var price = -1;
        for (var i in data) {
          if (parseFloat(data[i]["lowerLimit"]) < parseFloat(itemList[prop]["pdGiftQuantity"])) {
            if (parseFloat(data[i]["price"]) < price || price == -1) {
              price = parseFloat(data[i]["price"]);
            }
          }
        }
        if (price != -1) {
          continue;
        }
        var producturl = "https://www.example.com/" + request.access_token;
        strResponse = postman("post", producturl, null, JSON.stringify(params));
        responseObj = JSON.parse(strResponse);
        if ("200" == responseObj.code) {
          data = responseObj.data.content;
          for (var j in data) {
            if (parseFloat(data[j]["lowerLimit"]) < parseFloat(itemList[prop]["pdGiftQuantity"])) {
              if (parseFloat(data[j]["price"]) < price || price == -1) {
                price = parseFloat(data[j]["price"]);
              }
            }
          }
          if (price == -1) {
            continue;
          }
          summary += price * itemList[prop].fdMainQty;
          itemList[prop]["fdOldPrice"] = price * itemList[prop]["fdSaleUnitCount"];
        }
      }
    }
    return { itemList: itemList, summary: summary };
  }
}
exports({ entryPoint: MyAPIHandler });