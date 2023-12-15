let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = {};
    let salesOrderId = "";
    if (param != null && param != undefined) {
      data = param.data[0];
      salesOrderId = data.id;
      let salesOrderUrl = "https://www.example.com/";
      salesOrderUrl += `?id=${data.id}`;
      var apiResponseSales = openLinker("GET", salesOrderUrl, "SCMSA", null);
      var salesInfo = JSON.parse(apiResponseSales);
      // 使用OpenApi来获取单据的数据
      var agentRequest = {};
      agentRequest.id = salesInfo.data.agentId;
      // 使用openLinker调用开放接口
      let agentRequestUrl = "https://www.example.com/";
      agentRequestUrl += `?id=${agentRequest.id}`;
      var agentResponse = openLinker("GET", agentRequestUrl, "SCMSA", null);
      // 这里的agentResponse是字符串
      let agentInfo = JSON.parse(agentResponse);
      let agentCode = agentInfo.data.code;
      // 声明传递的对象
      let request = {};
      request.orderCode = salesInfo.data.code;
      request.opportunityCode = salesInfo.data.headFreeItem.define23;
      request.accountCode = agentCode;
      request.amount = salesInfo.data.payMoney;
      request.curr = salesInfo.data.orderPrices.originalCode;
      var currency_name = salesInfo.data.currencyName;
      var curr_Code = salesInfo.data.orderPrices.originalCode;
      var currId = salesInfo.data.orderPrices.currency;
      var targetId = "yourIdHere";
      if (curr_Code == "USD") {
        request.exchangeRate = 1;
      } else {
        // 汇率类型
        let exchangeRateType = "x0cp02ey";
        // 获取汇率对象
        var sqlExchangeRate = `select * from bd.exchangeRate.ExchangeRateVO where 1=1 and exchangeRateType = '${exchangeRateType}' and sourceCurrencyId = 'yourIdHere' and targetCurrencyId = 'yourIdHere' order by quotationDate desc limit 1`;
        var rowExchangeRate = ObjectStore.queryByYonQL(sqlExchangeRate, "ucfbasedoc");
        console.log(`rowExchangeRate   ---  ${JSON.stringify(rowExchangeRate)}`);
        if (rowExchangeRate != null) {
          //获取汇率-汇率模型的
          request.exchangeRate = rowExchangeRate[0].exchangeRate;
        } else {
          //获取汇率-汇率模型的
          request.exchangeRate = 1;
        }
        console.log(`request.exchangeRate   ---  ${request.exchangeRate}`);
      }
      request.currencyUSD = salesInfo.data.payMoney * request.exchangeRate;
      let testDate = new Date(salesInfo.data.createDate);
      var Y = testDate.getFullYear();
      var M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      var D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let order_Date = `${Y}${M}${D}`;
      request.createdDate = order_Date;
      Y = testDate.getFullYear(salesInfo.data.modifyDate);
      M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let modify_Date = `${Y}${M}${D}`;
      request.ModifiedDate = modify_Date;
      let close_Date = new Date();
      Y = close_Date.getFullYear();
      M = close_Date.getMonth() + 1 < 10 ? "0" + (close_Date.getMonth() + 1) : close_Date.getMonth() + 1;
      D = close_Date.getDate() < 10 ? "0" + close_Date.getDate() : close_Date.getDate();
      let audit_Date = `${Y}${M}${D}`;
      request.CloseDate = audit_Date;
      request.SalesCode = salesInfo.data.corpContact_code;
      request.oldOrder = "";
      let apiData = {
        data: request
      };
      let url = "https://www.example.com/";
      let apiResponse = openLinker("POST", url, "AT1601184E09C80009", JSON.stringify(apiData));
      let apiResult = JSON.parse(apiResponse);
      if (apiResult.code == "400") {
        let apiMsg = apiResult.msg;
        return { apiMsg };
      } else {
        return { apiResult };
      }
      // 提前准备Auth的内容
      let account = "YS-GBXMIWJD";
      let password = "yourpasswordHere";
      let usrPass = `${account}:${password}`;
      var b64Val = `Basic ${Base64Encode(usrPass)}`;
      const requestUrl = `https://ipaas.rifeng.com.cn:32443/298153907928989696/SF/pushOrderToSaleforce/1.0.0`;
      const header = {
        Authorization: b64Val,
        "Content-Type": "application/json"
      };
      var strResponse = new Object();
      if (salesInfo.data.transactionTypeId_name != "免费订单") {
        strResponse = postman("POST", requestUrl, JSON.stringify(header), JSON.stringify(apiData));
      }
      return {
        strResponse
      };
    }
    return {};
  }
}
exports({
  entryPoint: MyTrigger
});