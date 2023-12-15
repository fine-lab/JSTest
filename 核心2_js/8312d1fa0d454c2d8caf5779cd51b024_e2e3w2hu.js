let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = {};
    let salesReturnId = "";
    if (param != null && param != undefined) {
      data = param.data[0];
      salesReturnId = data.id;
      var sqlExec = `select orderNo from voucher.salereturn.SaleReturnDetail a left join voucher.salereturn.SaleReturn b on a.saleReturnId = b.id where b.id ='youridHere'`;
      var salesReturnInfo = ObjectStore.queryByYonQL(sqlExec, "udinghuo");
      // 声明传递的对象
      let request = {};
      request.orderCode = data.code;
      request.opportunityCode = data["headFreeItem!define21"];
      request.accountCode = data.agentId_code;
      request.amount = -data.payMoney;
      request.curr = data["currencyCode"];
      var currency_Code = data.currencyCode;
      var currency_name = data.currencyName;
      if (currency_Code == "USD") {
        request.exchangeRate = 1;
      } else {
        let exchangeRateType = data.exchangeRateType;
        // 获取汇率对象
        var sqlExchangeRate = `select * from bd.exchangeRate.ExchangeRateVO where 1=1 and exchangeRateType = '${exchangeRateType}' and sourceCurrencyId.name
= '${currency_name}' order by quotationDate desc limit 1`;
        var rowExchangeRate = ObjectStore.queryByYonQL(sqlExchangeRate);
        //获取汇率-销售订单的
        request.exchangeRate = data["orderPrices!exchRate"];
        //获取汇率-汇率模型的
        request.exchangeRate = rowExchangeRate[0].exchangeRate;
      }
      request.currencyUSD = request.amount * request.exchangeRate;
      let testDate = new Date(data.createDate);
      var Y = testDate.getFullYear();
      var M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      var D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let orderDate = `${Y}${M}${D}`;
      request.createdDate = orderDate;
      request.ModifiedDate = data.modifyDate;
      Y = testDate.getFullYear();
      M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let auditDate = `${Y}${M}${D}`;
      request.CloseDate = auditDate;
      request.SalesCode = "MX006";
      request.oldOrder = salesReturnInfo[0].orderNo;
      let apiData = { data: request };
      let account = "YS-K5L06GYK";
      let password = "yourpasswordHere";
      let usrPass = `${account}:${password}`;
      var b64Val = `Basic ${Base64Encode(usrPass)}`;
      const requestUrl = `https://ipaasqas.rifeng.com.cn:31443/298153907928989696/SF/pushOrderToSaleforce/1.0.0`;
      const header = {
        Authorization: b64Val,
        "Content-Type": "application/json"
      };
      var strResponse = postman("POST", requestUrl, JSON.stringify(header), JSON.stringify(apiData));
      // 根据类型进行判断
      if (data.status == 1) {
        // 待发货
        if (data.transactionTypeId_name == "普通销售（有发货）") {
          const requestUrl = `https://ipaasqas.rifeng.com.cn:31443/298153907928989696/SF/pushOrderToSaleforce/1.0.0`;
          const header = {
            "Content-Type": "application/json"
          };
          var strResponse = postman("POST", requestUrl, JSON.stringify(header), JSON.stringify(apiData));
          throw new Error(JSON.stringify(strResponse));
          // 获取token
          var responseObj = JSON.parse(strResponse);
          if ("00000" == responseObj.code) {
            access_token = responseObj.data.access_token;
          }
        }
      } else if (data.status == 2) {
        // 已完成
      }
    }
    return {};
  }
}
exports({ entryPoint: MyTrigger });