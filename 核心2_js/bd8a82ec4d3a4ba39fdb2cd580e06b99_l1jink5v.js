let AbstractAPIHandler = require("AbstractAPIHandler");
class MyAPIHandler extends AbstractAPIHandler {
  execute(request) {
    let itemList = request.itemList;
    let summary = 0;
    let message = "";
    for (let prop in itemList) {
      let rangeUrl = "https://www.example.com/" + request.access_token;
      let rangeParam = {
        enable: "1",
        pageIndex: 1,
        pageSize: 10,
        code: itemList[prop]["pdGiftInvCode"]
      };
      let strResponse = postman("post", rangeUrl, null, JSON.stringify(rangeParam));
      let responseObj = JSON.parse(strResponse);
      if ("200" !== responseObj.code) {
        throw new Error(responseObj.message);
      }
      let rangeId = responseObj.data.recordList[0].productApplyRangeId;
      let url = "https://www.example.com/" + request.access_token + "&id=" + itemList[prop]["pdGiftInv"] + "&productApplyRangeId=" + rangeId;
      strResponse = postman("get", url, null, null);
      responseObj = JSON.parse(strResponse);
      //成箱单位，销售单位
      let productAssistUnitExchanges = responseObj.data.productAssistUnitExchanges;
      let saleUnit = responseObj.data.detail.batchUnit_Name;
      let boxUnit = responseObj.data.detail.produceUnit_Name;
      let saleUnitCount, saleUnitName, saleUnitId;
      let boxUnitCount, boxUnitName, boxUnitId;
      for (let ii in productAssistUnitExchanges) {
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
      itemList[prop]["pdGiftInvClass"] = responseObj.data["manageClass"];
      itemList[prop]["pdGiftInvClass_name"] = responseObj.data["manageClass_Name"];
      let outTaxRateName = responseObj.data.detail.outTaxrate_Name;
      let outTaxRateId = responseObj.data.detail.outTaxrate;
      itemList[prop]["fdTaxRate"] = outTaxRateId;
      itemList[prop]["fdTaxRate_ntaxRate"] = outTaxRateName;
      itemList[prop]["fdWarehouse"] = responseObj.data.detail.deliveryWarehouse;
      itemList[prop]["fdWarehouse_name"] = responseObj.data.detail.deliveryWarehouse_Name;
      //计算成箱数量
      //数量必须大于0
      //根据比例计算数量
      if ((itemList[prop]["pdGiftQuantity"] == undefined || itemList[prop]["pdGiftQuantity"] <= 0) && request.type == "class") {
        message += "\n 【" + itemList[prop]["pdGiftInvCode"] + " 】填写数量为" + itemList[prop]["pdGiftQuantity"] + "已忽略";
        continue;
      }
      if (itemList[prop]["pdGiftQuantity"] > 0) {
        itemList[prop]["fdQuantity"] = itemList[prop]["pdGiftQuantity"];
        itemList[prop]["fdMainQty"] = itemList[prop]["fdQuantity"] * itemList[prop]["fdSaleUnitCount"];
        itemList[prop]["fdSaleQuantity"] = itemList[prop]["fdMainQty"] / itemList[prop]["fdBoxUnitCount"];
      } else {
        if (itemList[prop]["pdQuantityPro"] != undefined) {
          itemList[prop]["fdQuantity"] = Math.floor((itemList[prop]["pdQuantityPro"] * request.fdQuantity) / 100);
          itemList[prop]["fdMainQty"] = itemList[prop]["fdQuantity"] * itemList[prop]["fdSaleUnitCount"];
          itemList[prop]["fdSaleQuantity"] = itemList[prop]["fdMainQty"] / itemList[prop]["fdBoxUnitCount"];
        }
      }
      if (itemList[prop]["fdQuantity"] == 0) {
        message += "\n 【" + itemList[prop]["pdGiftInvCode"] + "】物料数量为0 已忽略";
        continue;
      }
      //查询单价
      let curDate = request.curDate;
      let params = {
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
      let lastDate;
      let urlPrice = "https://www.example.com/" + request.access_token;
      strResponse = postman("post", urlPrice, null, JSON.stringify(params));
      responseObj = JSON.parse(strResponse);
      if ("200" == responseObj.code) {
        //请求成功
        let data = responseObj.data.content;
        let price = -1;
        for (let i in data) {
          if (parseFloat(data[i]["lowerLimit"]) < parseFloat(itemList[prop]["fdMainQty"])) {
            if (lastDate == undefined || new Date(lastDate).getTime() < new Date(data[i]["startDate"]).getTime()) {
              price = parseFloat(data[i]["price"]);
              lastDate = data[i]["startDate"];
            }
          }
        }
        if (price != -1) {
          let x = new Big(itemList[prop].fdMainQty);
          let y = x.times(new Big(price));
          summary = summary + parseFloat(y);
          itemList[prop]["fdOldPrice"] = price * itemList[prop]["fdSaleUnitCount"];
          continue;
        }
        let producturl = "https://www.example.com/" + request.access_token;
        strResponse = postman("post", producturl, null, JSON.stringify(params));
        responseObj = JSON.parse(strResponse);
        if ("200" == responseObj.code) {
          data = responseObj.data.content;
          for (let j in data) {
            if (parseFloat(data[j]["lowerLimit"]) < parseFloat(itemList[prop]["fdMainQty"])) {
              if (lastDate == undefined || new Date(lastDate).getTime() < new Date(data[j]["startDate"]).getTime()) {
                price = parseFloat(data[j]["price"]);
                lastDate = data[j]["startDate"];
              }
            }
          }
          if (price != -1) {
            let x = new Big(itemList[prop].fdMainQty);
            let y = x.times(new Big(price));
            summary = summary + parseFloat(y);
            itemList[prop]["fdOldPrice"] = price * itemList[prop]["fdSaleUnitCount"];
            continue;
          }
        }
        message += "\n 【" + itemList[prop]["pdGiftInvCode"] + "】没有查询到对应价格 已忽略";
      }
    }
    return { itemList: itemList, summary: summary, message: message };
  }
}
exports({ entryPoint: MyAPIHandler });