let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = {};
    let salesOrderId = "";
    if (param != null && param != undefined) {
      data = param.data[0];
      salesOrderId = data.id;
      // 使用OpenApi来获取单据的数据
      var agentRequest = {};
      agentRequest.id = data.agentId;
      // 使用openLinker调用开放接口
      let agentRequestUrl = "https://www.example.com/";
      agentRequestUrl += `?id=${data.agentId}`;
      var agentResponse = openLinker("GET", agentRequestUrl, "SCMSA", null);
      // 这里的agentResponse是字符串
      let agentInfo = JSON.parse(agentResponse);
      let agentCode = agentInfo.data.code;
      // 使用YonQL来获取单据的数据
      // 声明传递的对象
      let request = {};
      request.orderCode = data.code;
      request.opportunityCode = data.orderDefineCharacter.attrext44;
      request.accountCode = agentCode;
      request.amount = data.payMoney;
      request.curr = data["orderPrices!originalCode"];
      var currency_name = data.currencyName;
      var curr_Code = data["orderPrices!originalCode"];
      var curr_Name = data["orderPrices!originalName"];
      if (curr_Code == "USD") {
        request.exchangeRate = 1;
      } else {
        // 汇率类型
        let exchangeRateType = data["orderPrices!exchangeRateType"];
        // 获取汇率对象
        var sqlExchangeRate = `select * from bd.exchangeRate.ExchangeRateVO order by quotationDate`;
        var rowExchangeRate = ObjectStore.queryByYonQL(sqlExchangeRate);
        //获取汇率-销售订单的
        request.exchangeRate = data["orderPrices!exchRate"];
        //获取汇率-汇率模型的
        request.exchangeRate = rowExchangeRate[0].exchangeRate;
      }
      request.currencyUSD = data.payMoney * request.exchangeRate;
      let testDate = new Date(data.orderDate);
      var Y = testDate.getFullYear();
      var M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      var D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let orderDate = `${Y}${M}${D}`;
      request.createdDate = orderDate;
      Y = testDate.getFullYear();
      M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let modifyDate = `${Y}${M}${D}`;
      request.ModifiedDate = modifyDate;
      Y = testDate.getFullYear();
      M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let auditDate = `${Y}${M}${D}`;
      request.CloseDate = auditDate;
      request.SalesCode = agentInfo.data.corpContact_code;
      request.oldOrder = "";
      let apiData = { data: request };
      // 提前准备Auth的内容
      let account = "YS-K5L06GYK";
      let password = "yourpasswordHere";
      let usrPass = `${account}:${password}`;
      var b64Val = `Basic ${Base64Encode(usrPass)}`;
      const requestUrl = `https://ipaasqas.rifeng.com.cn:31443/298153907928989696/SF/pushOrderToSaleforce/1.0.0`;
      const header = {
        Authorization: b64Val,
        "Content-Type": "application/json"
      };
      throw new Error(JSON.stringify(apiData));
      var strResponse = postman("post", requestUrl, JSON.stringify(header), JSON.stringify(apiData));
      throw new Error(JSON.stringify(strResponse));
      return { strResponse };
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });