let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let data = {};
    let salesInvoiceId = "";
    if (param != null && param != undefined) {
      data = param.data[0];
      salesInvoiceId = data.id;
      // 声明传递的对象
      let request = {};
      request.code = data.code;
      request.orderCode = data.saleInvoiceDetails[0].orderNo;
      request.amount = data.oriSum;
      request.curr = data.currency_code;
      let testDate = new Date(data.vouchdate);
      var Y = testDate.getFullYear();
      var M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      var D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let vouchdate = `${Y}${M}${D}`;
      request.createdDate = vouchdate;
      testDate = new Date(data.auditDate);
      Y = testDate.getFullYear();
      M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let auditDate = `${Y}${M}${D + 1}`;
      request.approvalDate = auditDate;
      request.status = 1;
      //汇率类型
      let exchangeRateType = data["exchangeRateType"];
      // 获取汇率对象
      var currencyCode = data.currency_code;
      var currency_name = data.currency_name;
      var nat_currency_name = data.natCurrency_name; //本币种名称
      var nat_currency_code = data.natCurrency_code; //本币种编码
      if (currencyCode == "USD") {
        request.exchangeRate = 1;
      } else {
        var sqlExchangeRate = `select * from bd.exchangeRate.ExchangeRateVO where 1=1 and exchangeRateType = '${exchangeRateType}' and sourceCurrencyId.name = '${currency_name}' and targetCurrencyId.name = '${nat_currency_name}' order by quotationDate desc limit 1`;
        var rowExchangeRate = ObjectStore.queryByYonQL(sqlExchangeRate);
        //获取汇率-销售订单的
        request.exchangeRate = data.exchRate;
        //获取汇率-汇率模型的
        if (rowExchangeRate.length == 0) {
          request.exchangeRate = 1;
        } else {
          request.exchangeRate = rowExchangeRate[0].exchangeRate;
          throw new Error(request.exchangeRate);
        }
      }
      request.currencyUSD = request.amount * request.exchangeRate;
      let invDirection = data.invDirection;
      request.oriMoney = data.oriMoney;
      request.oriTax = data.oriTax;
      request.natMoney = data.natMoney;
      request.natTex = data.natTex;
      //判断是红票还是蓝票
      if (request.invDirection == 1) {
        request.amount = -request.amount;
        request.oriMoney = -request.oriMoney;
        request.oriTax = -request.oriTax;
        request.natMoney = -request.natMoney;
        request.natTex = request.natTex;
      }
      let apiData = {
        data: request
      };
      //提前准备Auth的内容
      let account = "YS-K5L06GYK";
      let password = "yourpasswordHere";
      let usrPass = `${account}:${password}`;
      var b64Val = `Basic ${Base64Encode(usrPass)}`;
      const requestUrl = "https://ipaasqas.rifeng.com.cn:31443/298153907928989696/SF/pushInvoiceToSaleforce/1.0.0";
      const header = {
        Authorization: b64Val,
        "Content-Type": "application/json"
      };
      var strResponse_V1 = postman("POST", requestUrl, JSON.stringify(header), JSON.stringify(apiData));
      // 根据类型进行判断
      if (data.status == 1) {
        // 待发货
        if (data.transactionTypeId_name == "普通销售（有发货）") {
          const requestUrl = `https://ipaasqas.rifeng.com.cn:31443/298153907928989696/SF/pushOrderToSaleforce/1.0.0`;
          const header = {
            "Content-Type": "application/json"
          };
          var strResponse = postman("POST", requestUrl, JSON.stringify(header), JSON.stringify(apiData));
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
exports({
  entryPoint: MyTrigger
});