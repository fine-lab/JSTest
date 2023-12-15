let AbstractTrigger = require("AbstractTrigger");
class MyTrigger extends AbstractTrigger {
  execute(context, param) {
    let outputlog = "";
    let data = {};
    let salesInvoiceId = "";
    let result = "ok";
    if (param != null && param != undefined) {
      data = param.data[0];
      salesInvoiceId = data.id;
      // 声明传递的对象
      let request = {};
      request.code = data.code;
      request.orderCode = data.saleInvoiceDetails[0].orderNo;
      request.amount = data.oriSum;
      request.curr = data.currency_code;
      outputlog += "step2,";
      let testDate = new Date(data.createTime);
      var Y = testDate.getFullYear();
      var M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      var D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let vouchdate = `${Y}${M}${D}`;
      request.createdDate = vouchdate;
      testDate = new Date();
      Y = testDate.getFullYear();
      M = testDate.getMonth() + 1 < 10 ? "0" + (testDate.getMonth() + 1) : testDate.getMonth() + 1;
      D = testDate.getDate() < 10 ? "0" + testDate.getDate() : testDate.getDate();
      let auditDate = `${Y}${M}${D}`;
      request.approvalDate = auditDate;
      request.status = 1;
      //汇率类型
      let exchangeRateType = "x0cp02ey";
      // 获取汇率对象
      var currencyCode = data.currency_code; //目的币种编码
      var currency_name = data.currency_name; //目的币种名称
      var nat_currency_name = data.natCurrency_name; //本币种名称
      var nat_currency_code = data.natCurrency_code; //本币种编码
      var currId = data.natCurrency;
      var targetId = "yourIdHere";
      if (currencyCode == "USD") {
        request.exchangeRate = 1;
        //货值（USD）=货值*汇率
        request.currencyUSD = request.amount;
      } else {
        //根据本币及目标币种美元查询汇率中维护的最新的一条汇率信息
        var sqlExchangeRate = `select * from bd.exchangeRate.ExchangeRateVO where 1=1 and exchangeRateType = '${exchangeRateType}' and sourceCurrencyId = 'yourIdHere' and targetCurrencyId = 'yourIdHere' order by quotationDate desc limit 1`;
        var rowExchangeRate = ObjectStore.queryByYonQL(sqlExchangeRate, "ucfbasedoc");
        if (rowExchangeRate.length > 0) {
          //获取汇率-销售订单的
          request.exchangeRate = data.exchRate;
          //获取汇率-汇率模型的
          request.exchangeRate = rowExchangeRate[0].exchangeRate; //直接汇率
          //货值（USD）=货值*汇率
          request.currencyUSD = request.amount * request.exchangeRate;
        } else {
          request.exchangeRate = 1;
          //货值（USD）=货值*汇率
          request.currencyUSD = request.amount;
        }
      }
      let invDirection = data.invDirection;
      request.oriMoney = data.oriMoney;
      request.oriTax = data.oriTax;
      request.natMoney = data.natMoney;
      request.natTax = data.natTax;
      //判断是红票还是蓝票
      if (request.invDirection == 1) {
        request.amount = -request.amount;
        request.oriMoney = -request.oriMoney;
        request.oriTax = -request.oriTax;
        request.natMoney = -request.natMoney;
        request.natTax = request.natTax;
      }
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
    }
    return { result };
  }
}
exports({
  entryPoint: MyTrigger
});